import { createServer } from 'http';
import { EventHandler } from 'playcanvas';
import WebSocket from 'faye-websocket';

import levels from './levels/levels.js';

import Users from './users/users.js';
import User from './users/user.js';

import Room from './room.js';

class Network extends EventHandler {
    port = 8080;
    users = new Users();
    rooms = new Map();

    initialize(levelProvider) {
        if (this.server) return;

        this.on('_room:create', async ({ tickrate, levelId, payload }, user) => {
            try {
                const room = new Room(tickrate, payload);
                await room.initialize(levelId);
                this.rooms.set(room.id, room);

                room.on('destroy', () => this.rooms.delete(room.id));

                room.join(user);
            } catch (ex) {
                console.log('unable to create room');
                console.error(ex);

                throw ex;
            }
        });

        this.on('_room:join', (roomId, user, callback) => {
            const room = this.rooms.get(roomId);
            if (!room) {
                callback(new Error(`Room ${roomId} not found`));
                return;
            }

            room.join(user);
        });

        this.on('_room:leave', (roomId, user) => {
            const room = this.rooms.get(roomId);
            if (!room) return { success: false };

            room.leave(user);

            return { success: true };
        });

        this.on('_level:save', async (level, _, callback) => {
            try {
                await levels.save(level.scene, level);
                callback(null);
            } catch (ex) {
                callback(new Error('Unable to save level'));
                console.log('unable to save level');
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

                if (!msg.roomId) {
                    this.fire(msg.name, msg.data, user, (err, result) => {
                        if (!msg.callbackId) return;

                        user.send(msg.name, err ? { err: err.message } : result, null, msg.callbackId);
                    });

                    return;
                }

                const room = this.rooms.get(msg.roomId);
                if (!room) return;

                const player = room.players.getByUserId(user.id);
                if (!player) return;

                player.fire(msg.name, msg.data, (err, result) => {
                    if (!msg.callbackId) return;

                    player.send(msg.name, err ? { err: err.message } : result, msg.callbackId);
                });
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
