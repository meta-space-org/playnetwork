import { parentPort, workerData } from 'worker_threads';
import * as pc from 'playcanvas';

import Channel from '../server/core/channel.js';

import '../server/libs/logger.js';

import levels from './libs/levels.js';
import scripts from './libs/scripts.js';
import templates from './libs/templates.js';
import performance from './libs/node-performance.js';

import Rooms from './rooms.js';
import Users from './users.js';
import User from './user.js';

import Ammo from './libs/ammo.js';
if (workerData.useAmmo) global.Ammo = await new Ammo();

global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

/**
 * @class Node
 * @classdesc Each {@link WorkerNode} creates a worker process and instantiates
 * a {@link Node}, which is running in own thread on a single core.
 * {@link PlayNetwork} creates multiple {@link WorkerNode}s to utilize all
 * available CPU threads of a server. {@link Node} handles multiple {@link User}s and
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

global.DEBUG = process.execArgv.indexOf('--inspect') !== -1;

class Node extends pc.EventHandler {
    constructor() {
        super();

        if (!parentPort) return;

        this.idsArray = null;

        process.on('uncaughtException', (err) => {
            if (DEBUG) console.error(err);
            this.fire('error', err);
            return true;
        });

        process.on('unhandledRejection', (err, promise) => {
            if (DEBUG) console.error(err);
            err.promise = promise;
            this.fire('error', err);
            return true;
        });

        this.users = new Users();
        this.rooms = new Rooms();
        this.networkEntities = new Map();

        this.channel = new Channel(parentPort, this, this.users);

        performance.connectChannel(this.channel);

        performance.addCpuLoad(this);
        performance.addMemoryUsage(this);
        performance.addBandwidth(this);
        this.on('_node:init', (_, data) => {
            this.idsArray = new Int32Array(data.idsBuffer);
            for (let i = 0; i < 2; i++) Atomics.load(this.idsArray, i);
        });

        this.on('_pong', (_, { roomId, userId }) => {
            performance.handlePong(roomId, userId);
        });
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

        this.on('_open', (_, userId, callback) => {
            const user = new User(userId);
            this.users.add(user);
            callback();
        });

        this.on('_message', (user, msg, callback) => {
            this._onMessage(user, msg, callback);
        });

        this.on('_close', (_, userId, callback) => {
            const user = this.users.get(userId);
            if (!user) return;

            user.destroy();
            callback();
        });
    }

    send(name, data, callback) {
        this.channel.send(name, data, null, callback);
    }

    generateId(type) {
        const typeIndexes = {
            room: 0,
            networkEntity: 1
        };

        return Atomics.add(this.idsArray, typeIndexes[type], 1);
    }

    async _onMessage(user, msg, callback) {
        let target = null;

        switch (msg.scope.type) {
            case 'user':
                target = this.users.get(msg.scope.id); // user
                break;
            case 'room':
                target = this.rooms.get(msg.scope.id); // room
                break;
            case 'networkEntity':
                target = this.networkEntities.get(msg.scope.id); // networkEntity
                break;
        }

        if (!target) return;
        target.fire(msg.name, user, msg.data, callback);
    }
}

export default new Node();
