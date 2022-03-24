import { parentPort, workerData } from 'worker_threads';
import * as pc from 'playcanvas';

import Channel from './../server/core/channel.js';

import levels from './libs/levels.js';
import scripts from './libs/scripts.js';
import templates from './libs/templates.js';
import performance from './libs/node-performance.js';

import Rooms from './rooms.js';
import Users from './users.js';
import User from './user.js';

import Ammo from './libs/ammo.js';
global.Ammo = await new Ammo();

global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

/**
 * @class Node
 * @classdesc Each {@link WorkerNode} creates a worker process and instantiates
 * a {@link Node}, which is running in own thread on a single core.
 * {@link PlayNetwork} creates multiple {@link WorkerNode}s to utilize all
 * available CPUs of a server. {@link Node} handles multiple {@link User}s and
 * {@link Room}s.
 * @extends pc.EventHandler
 * @property {Users} users Interface with list of this Node {@link User}s.
 * @property {Rooms} rooms Interface with list of this Node {@link Room}s.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {number} cpuLoad Current CPU load 0..1.
 * @property {number} memory Current memory usage in bytes.
 */

/**
 * @event Node#error
 * @description Unhandled error.
 * @param {Error} error
 */

class Node extends pc.EventHandler {
    constructor() {
        super();

        if (!parentPort) return;

        process.on('uncaughtException', (err) => {
            this.fire('error', err);
            return true;
        });

        process.on('unhandledRejection', (err, promise) => {
            err.promise = promise;
            this.fire('error', err);
            return true;
        });

        this.users = new Users();
        this.players = new Map();
        this.rooms = new Rooms();
        this.networkEntities = new Map();

        this.channel = new Channel(parentPort);

        performance.connectChannel(this.channel);

        performance.addCpuLoad(this);
        performance.addMemoryUsage(this);
        performance.addBandwidth(this);
    }

    /**
     * @method start
     * @description Start a Node, by providing Level Provider (to save/load
     * hierarchy data)
     * @async
     * @param {object} levelProvider Instance of a level provider.
     */
    async start(levelProvider) {
        const settings = workerData;

        await levels.initialize(levelProvider);
        await scripts.initialize(settings.scriptsPath);
        await templates.initialize(settings.templatesPath);
        this.rooms.initialize();

        this.channel.on('_open', async (clientId, callback) => {
            const user = new User(clientId);
            this.users.add(user);
            callback();
        });

        this.channel.on('_message', (e) => {
            const user = this.users.get(e.clientId);
            if (!user) return;

            this._onMessage(e.msg, user);
        });

        this.channel.on('_close', (clientId, callback) => {
            const user = this.users.get(clientId);
            if (!user) return;

            user.destroy();
            callback();
        });
    }

    addPlayer(player) {
        this.players.set(player.id, player);

        player.once('destroy', () => {
            this.players.delete(player.id);
        });
    }

    async generateId(type) {
        return new Promise((resolve) => {
            this.channel.send('_id:generate', type, (id) => {
                resolve(id);
            });
        });
    }

    async _onMessage(msg, user) {
        let target = null;
        let from = null;

        switch (msg.scope.type) {
            case 'user':
                target = this; // node
                from = this.users.get(user.id); // user
                break;
            case 'room':
                target = this.rooms.get(msg.scope.id); // room
                from = target?.getPlayerByUser(user); // player
                break;
            case 'player':
                target = this.players.get(msg.scope.id); // player
                from = target?.room.getPlayerByUser(user); // player
                break;
            case 'networkEntity':
                target = this.networkEntities.get(msg.scope.id); // networkEntity
                from = target?.app.room.getPlayerByUser(user); // player
                break;
        }

        if (!target || !from) return;

        target.fire(msg.name, from, msg.data, (err, data) => {
            if (!msg.id) return;
            user._send(msg.name, err ? { err: err.message } : data, null, null, msg.id);
        });
    }
}

export default new Node();
