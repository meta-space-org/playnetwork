import * as http from 'http';
import * as pc from 'playcanvas';
import WebSocket from 'faye-websocket';

import scripts from './libs/scripts.js';
import templates from './libs/templates.js';
import levels from './libs/levels.js';

import Rooms from './core/rooms.js';
import Users from './core/users.js';
import User from './core/user.js';

import Ammo from './libs/ammo.js';
global.Ammo = await new Ammo();

global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

/**
 * @class PlayNetwork
 * @classdesc Main interface of PlayNetwork, which provides access to
 * all process {@link User}s and {@link Room}s.
 * @property {Users} users Interface with list of all {@link User}s.
 * @property {Rooms} rooms
 */
class PlayNetwork extends pc.EventHandler {
    users = new Users();
    players = new Map();
    rooms = new Rooms();

    /**
     * @method initialize
     * @description Initialize PlayNetwork, by providing configuration parameters,
     * Level Provider (to save/load hierarchy data) and HTTP(s) server handle.
     * @async
     * @param {object} settings Object with settings for initialization.
     * @param {object} settings.levelProvider Instance of level provider.
     * @param {string} settings.scriptsPath Relative path to script components.
     * @param {string} settings.templatesPath Relative path to templates.
     * @param {object} settings.server Instance of a http server.
     */
    async initialize(settings) {
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
            });

            socket.on('message', async (e) => this._onMessage(e.data, user));

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                user.destroy();
                socket = null;
            });
        });

        console.log('PlayNetwork initialized');
    }

    addPlayer(player) {
        this.players.set(player.id, player);

        player.once('destroy', () => {
            this.players.delete(player.id);
        });
    }

    async _onMessage(data, user) {
        const msg = JSON.parse(data);
        let target = null;
        let from = null;

        switch (msg.scope.type) {
            case 'user':
                target = this; // playnetwork
                from = this.users.get(user.id); // user
                break;
            case 'room':
                target = this.rooms.get(msg.scope.id); // room
                from = target.getPlayerByUser(user); // player
                break;
            case 'player':
                target = this.players.get(msg.scope.id); // player
                // TODO
                // player might not exist
                from = target.room.getPlayerByUser(user); // player
                break;
        }

        if (!target || !from) return;

        target.fire(msg.name, from, msg.data, (err, data) => {
            if (!msg.id) return;
            user._send(msg.name, err ? { err: err.message } : data, null, null, msg.id);
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

        if (!settings.server || !(settings.server instanceof http.Server))
            error += 'settings.server is required\n';

        if (error) throw new Error(error);
    }
}

export default new PlayNetwork();
