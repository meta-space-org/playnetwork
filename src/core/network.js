import { createServer } from 'http';
import { EventHandler } from 'playcanvas';
import WebSocket from 'faye-websocket';

import levels from './levels/levels.js';

import Users from './users/users.js';
import User from './users/user.js';

import Players from './players/players.js';

import Room from './room.js';

class Network extends EventHandler {
    port = 8080;
    users = new Users();
    players = new Players();
    rooms = new Map();

    initialize(levelProvider) {
        if (this.server) return;

        this.on('_room:create', async (from, { levelId, tickrate, payload }, callback) => {
            if (!Number.isInteger(tickrate) || tickrate < 0) {
                callback(new Error('Tickrate must be a positive integer'));
                return;
            }

            if (!Number.isInteger(levelId) || levelId < 0) {
                callback(new Error('Level ID must be a positive integer'));
                return;
            }

            if (!(await levelProvider.has(levelId))) {
                callback(new Error('Level does not exist'));
                return;
            }

            try {
                const room = await this.createRoom(levelId, tickrate, payload);
                room.join(from);

                callback();
            } catch (ex) {
                console.log('unable to create room');
                console.error(ex);

                throw ex;
            }
        });

        this.on('_room:join', (from, roomId, callback) => {
            const room = this.rooms.get(roomId);
            if (!room) {
                callback(new Error(`Room ${roomId} not found`));
                return;
            }

            room.join(from);
            callback();
        });

        this.on('_room:leave', (from, roomId, callback) => {
            const room = this.rooms.get(roomId);
            if (!room) {
                callback(new Error(`Room ${roomId} not found`));
                return;
            }

            room.leave(from);
            callback();
        });

        this.on('_level:save', async (_, level, callback) => {
            try {
                await levels.save(level.scene, level);
                callback();
            } catch (ex) {
                callback(new Error('Unable to save level'));
                console.log('Unable to save level');
                console.error(ex);
            }
        });

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

        this.server.listen(this.port);
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
