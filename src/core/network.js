import { createServer } from 'http';
import { EventHandler } from 'playcanvas';

import levels from './levels.js';
import templates from './templates.js';
import Room from './room.js';
import User from './user.js';
import WebSocket from 'faye-websocket';

class Network extends EventHandler {
    rooms = new Map();
    port = 8080;
    reservedMessages = ['room:create', 'room:join', 'room:leave', 'level:save'];

    constructor() {
        super();
    }

    initialize(levelProvider) {
        if (this.server)
            return;

        const handlers = {
            'room:create': async ({ levelId, roomType }, user) => {
                try {
                    const room = await this.createRoom(levelId, roomType);
                    const success = this.joinRoom(room.id, user);
                    return { success };
                } catch(ex) {
                    console.log(ex);
                    return { success: false };
                }
            },
            'room:join': (roomId, user) => {
                this.joinRoom(roomId, user);
            },
            'room:leave': async (roomId, user) => {
                const room = this.rooms.get(roomId);

                if (!room || !user.rooms.has(roomId))
                    return;

                room.leave(user);

                this.fire('room:left', room, user);
            },
            'level:save': async (level) => {
                try {
                    await levels.save(level.scene, level);
                    return { success: true };
                } catch(ex) {
                    console.log(`unable to save level`);
                    console.error(ex);
                    return { success: true };
                }
            }
        }

        global.LevelProvider = levelProvider;

        this.server = createServer();

        const self = this;
        this.server.on('upgrade', function(request, ws, body) {
            if (WebSocket.isWebSocket(request)) {
                let socket = new WebSocket(request, ws, body);
                const user = socket.user = new User(socket, Date.now());

                socket.on('open', (e) => {
                    user.send('self', {
                        userId: user.id,
                        data: user.data,
                        templates: templates.toData()
                    });

                    self.fire('user:connect', user);
                });

                socket.on('message', async (e) => {
                    const data = JSON.parse(e.data);
                    const handler = handlers[data.name];

                    if (handler) {
                        const result = await handler.call(self, data.data, user);

                        if (result && data.callbackId >= 0) {
                            user.send(data.name, result, null, data.callbackId);
                        }
                    } else if (self.reservedMessages.indexOf(data.name) === -1) {
                        user.fire(data.name, data.data);
                    }
                });

                socket.on('close', (e) => {
                    console.log('close', e.code, e.reason);
                    self.fire('user:disconnect', socket.user);
                    socket = null;
                });
            }
        });

        this.server.listen(this.port);
    }

    async createRoom(levelId, roomType) {
        let roomId = null;

        try {
            const room = new Room(roomType);
            roomId = room.id;

            this.fire('room:create', room);

            await room.initialize(levelId);
            this.rooms.set(room.id, room);

            this.fire('room:initialize', room);

            return room;
        } catch(ex) {
            this.rooms.delete(roomId);

            console.log('unable to create room');
            console.error(ex);

            throw ex;
        }
    }

    joinRoom(roomId, user) {
        const room = this.rooms.get(roomId);

        if (!room || user.rooms.has(roomId))
            return false;

        room.join(user);

        this.fire('room:join', room, user);

        return true;
    }
}

export default new Network();
