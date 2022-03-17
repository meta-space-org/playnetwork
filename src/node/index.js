import { parentPort, workerData } from 'worker_threads';
import * as pc from 'playcanvas';

import Channel from './../server/core/channel.js';

import scripts from './libs/scripts.js';
import templates from './libs/templates.js';

import Rooms from './rooms.js';
import Users from './users.js';
import User from './user.js';

import Ammo from './libs/ammo.js';
global.Ammo = await new Ammo();

global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

class Node extends pc.EventHandler {
    constructor() {
        super();

        if (!parentPort) return;

        this.users = new Users();
        this.players = new Map();
        this.rooms = new Rooms();
        this.networkEntities = new Map();

        this.channel = new Channel(parentPort);

        this.start(workerData);
    }

    async start(settings) {
        await scripts.initialize(settings.scriptsPath);
        await templates.initialize(settings.templatesPath);
        this.rooms.initialize();

        this.channel.on('_open', async (clientId, callback) => {
            const user = new User(clientId);
            this.users.add(user);
            callback();
        });

        this.channel.on('_message', (msg) => {
            const user = this.users.get(msg.clientId);
            if (!user) return;

            this._onMessage(msg.data, user);
        });

        this.channel.on('_close', (clientId) => {
            const user = this.users.get(clientId);
            if (!user) return;

            user.destroy();
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
