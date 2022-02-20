import { EventHandler } from 'playcanvas';
import WebSocket from 'faye-websocket';

import server from './server.js';

import scripts from './core/scripts.js';
import templates from './core/templates.js';
import levels from './levels/levels.js';

import Users from './users/users.js';
import User from './users/user.js';

import Players from './players/players.js';

import Room from './rooms/room.js';
import rooms from './rooms/rooms.js';

import Ammo from './libs/ammo.js';

class Network extends EventHandler {
    port = 8080;
    users = new Users();
    players = new Players();

    async initialize(settings) {
        if (this.server) return;

        global.Ammo = await new Ammo();
        console.log('physics initialized');

        await scripts.initialize(settings.scriptsPath);
        await templates.initialize(settings.templatesPath);
        levels.initialize(settings.levelProvider);
        rooms.initialize();

        server.initialize(this.port).on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            const params = new URL(req.url, req.protocol + '://' + req.headers.host + '/').searchParams;
            const ticket = params.get('ticket');

            if (!server.tickets.has(ticket)) {
                console.log(`Invalid ticket ${ticket}`);
                ws.destroy();
                return;
            }

            let socket = new WebSocket(req, ws, body);
            const user = socket.user = new User(socket);

            socket.on('open', () => {
                this.users.add(user);
                this.fire('user:connect', user);
            });

            socket.on('message', async (e) => {
                const msg = JSON.parse(e.data);
                let target = null;
                let from = null;

                switch (msg.scope.type) {
                    case 'user':
                        from = this.users.get(user.id);
                        target = this;
                        break;
                    case 'room':
                        from = this.players.getByUserId(user.id);
                        target = this.rooms.get(msg.scope.id);
                        break;
                    case 'player':
                        from = this.players.getByUserId(user.id);
                        target = this.players.get(msg.scope.id);
                        break;
                }

                if (!target || !from) return;

                target.fire(msg.name, from, msg.data, (err, result) => {
                    if (!msg.callbackId) return;
                    from.send(msg.name, err ? { err: err.message } : result, msg.callbackId);
                });
            });

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                user.destroy();
                this.fire('user:disconnect', user);
                socket = null;
            });
        });
    }

    async createRoom(levelId, tickrate, payload) {
        const room = new Room(tickrate, payload);
        await room.initialize(levelId);
        this.rooms.set(room.id, room);

        room.on('destroy', () => this.rooms.delete(room.id));

        return room;
    }
}

export default new Network();
