import * as http from 'http';
import * as https from 'https';
import * as pc from 'playcanvas';
import WebSocket from 'faye-websocket';
import deflate from './libs/permessage-deflate/permessage-deflate.js';

import scripts from './libs/scripts.js';
import templates from './libs/templates.js';
import levels from './libs/levels.js';
import performance from './libs/performance.js';

import Rooms from './core/rooms.js';
import Users from './core/users.js';
import User from './core/user.js';

import { encodeBuffer } from './libs/utils.js';

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
 * @extends pc.EventHandler
 * @property {Users} users Interface with list of all {@link User}s.
 * @property {Rooms} rooms
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {number} cpuLoad Current CPU load 0..1.
 * @property {number} memory Current memory usage in bytes.
 */

class PlayNetwork extends pc.EventHandler {
    users = new Users();
    players = new Map();
    rooms = new Rooms();
    networkEntities = new Map();

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

        performance.addCpuLoad(this);
        performance.addMemoryUsage(this);
        performance.addBandwidth(this);

        settings.server.on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            let socket = new WebSocket(req, ws, body, [], { extensions: [deflate] });
            const user = socket.user = new User(socket);

            socket.on('open', () => {
                this.users.add(user);
            });

            socket.on('message', async (e) => {
                if (typeof e.data !== 'string') {
                    e.rawData = e.data.rawData;
                    e.data = encodeBuffer(e.data.data);
                } else {
                    e.rawData = e.data;
                }

                if (e.data === 'ping' || e.data === 'pong') return;
                const msg = JSON.parse(e.data);
                e.msg = msg;
                this._onMessage(msg, user);
            });

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                user.destroy();
                socket = null;
            });

            performance.connectSocket(socket);
        });

        console.log('PlayNetwork initialized');
    }

    addPlayer(player) {
        this.players.set(player.id, player);

        player.once('destroy', () => {
            this.players.delete(player.id);
        });
    }

    async _onMessage(msg, user) {
        let target = null;
        let from = null;

        switch (msg.scope.type) {
            case 'user':
                target = this; // playnetwork
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

    _validateNetworkSettings(settings) {
        let error = '';

        if (!settings.levelProvider)
            error += 'settings.levelProvider is required\n';

        if (!settings.scriptsPath)
            error += 'settings.scriptsPath is required\n';

        if (!settings.templatesPath)
            error += 'settings.templatesPath is required\n';

        if (!settings.server || (!(settings.server instanceof http.Server) && !(settings.server instanceof https.Server)))
            error += 'settings.server is required\n';

        if (error) throw new Error(error);
    }
}

export default new PlayNetwork();
