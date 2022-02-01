import { createServer } from 'http';
import { EventHandler } from 'playcanvas';
import WebSocket from 'faye-websocket';

import levels from './levels/levels.js';

import Users from './users/users.js';
import User from './users/user.js';

import Room from './room.js';

class Network extends EventHandler {
    port = 8080;
    reservedMessages = new Set(['room:create', 'room:join', 'room:leave', 'level:save']);
    users = new Users();
    rooms = new Map();

    initialize(levelProvider) {
        if (this.server) return;

        const handlers = {
            'room:create': async ({ levelId }, user) => {
                try {
                    const room = new Room(levelId);
                    await room.initialize(levelId);
                    this.rooms.set(room.id, room);

                    room.on('destroy', () => this.rooms.delete(room.id));

                    const success = room.join(user);
                    return { success };
                } catch (ex) {
                    console.log('unable to create room');
                    console.error(ex);

                    throw ex;
                }
            },
            'room:join': (roomId, user) => {
                const room = this.rooms.get(roomId);
                if (!room) return { success: false };

                room.join(user);

                return { success: true };
            },
            'room:leave': (roomId, user) => {
                const room = this.rooms.get(roomId);
                if (!room) return { success: false };

                room.leave(user);

                return { success: true };
            },
            'level:save': async (level) => {
                try {
                    await levels.save(level.scene, level);
                    return { success: true };
                } catch (ex) {
                    console.log('unable to save level');
                    console.error(ex);
                    return { success: true };
                }
            }
        };

        global.LevelProvider = levelProvider;

        this.server = createServer();

        this.server.on('upgrade', (request, ws, body) => {
            if (!WebSocket.isWebSocket(request)) return;

            let socket = new WebSocket(request, ws, body);
            const user = socket.user = new User(socket);

            socket.on('open', () => {
                this.users.add(user);
                this.fire('user:connect', user);
            });

            socket.on('message', async (e) => {
                const data = JSON.parse(e.data);
                const handler = handlers[data.name];

                if (handler) {
                    const result = await handler.call(this, data.data, user);

                    if (result && data.callbackId >= 0) {
                        user.send(data.name, result, null, data.callbackId);
                    }
                } else if (!this.reservedMessages[data.name] && data.roomId) {
                    const room = this.rooms.get(data.roomId);
                    if (!room) return;

                    const player = room.players.getByUserId(user.id);
                    if (!player) return;

                    player.fire(data.name, data.data);
                }
            });

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                user.destroy();
                socket = null;
            });
        });

        this.server.listen(this.port);
    }
}

export default new Network();
