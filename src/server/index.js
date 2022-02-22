import * as pc from 'playcanvas';
import WebSocket from 'faye-websocket';

import scripts from './core/scripts.js';
import templates from './core/templates.js';
import levels from './core/levels.js';
import Rooms from './rooms/rooms.js';

import Users from './users/users.js';
import User from './users/user.js';

import Players from './players/players.js';

import Ammo from './libs/ammo.js';
global.Ammo = await new Ammo();

global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

class Network extends pc.EventHandler {
    users = new Users();
    players = new Players();
    rooms = new Rooms();

    async initialize(settings) {
        if (this.server) return;

        this._validateNetworkSettings(settings);

        await scripts.initialize(settings.scriptsPath);
        await templates.initialize(settings.templatesPath);
        levels.initialize(settings.levelProvider);
        this.rooms.initialize();

        settings.server.on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            let socket = new WebSocket(req, ws, body);
            const user = socket.user = new User(socket);

            socket.on('open', () => {
                this.users.add(user);
                this.fire('user:connect', user);
            });

            socket.on('message', async (e) => {
                this._onMessage(e.data, user);
            });

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                user.destroy();
                this.fire('user:disconnect', user);
                socket = null;
            });
        });

        console.log('network initialized');
    }

    async _onMessage(data, user) {
        const msg = JSON.parse(data);
        let target = null;
        let from = null;

        switch (msg.scope.type) {
            case 'user':
                target = this;
                from = this.users.get(user.id);
                break;
            case 'room':
                target = this.rooms.get(msg.scope.id);
                from = target.players.getByUserId(user.id);
                break;
            case 'player':
                target = this.players.get(msg.scope.id);
                from = target.room.players.getByUserId(user.id);
                break;
        }

        if (!target || !from) return;

        target.fire(msg.name, from, msg.data, (err, result) => {
            if (!msg.callbackId) return;
            from.send(msg.name, err ? { err: err.message } : result, msg.callbackId);
        });
    }

    _validateNetworkSettings(settings) {
        let error = '';

        if (!settings.levelProvider)
            error += 'settings.levelProvider is required\n';

        if (!settings.scriptsPath)
            error += 'settings.scriptsPath is required\n';

        if (!settings.templatesPath)
            error += 'settings.templatesPath is required\n';

        if (error) throw new Error(error);
    }
}

export default new Network();
