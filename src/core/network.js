import { createServer } from 'http';
import { EventHandler } from 'playcanvas';

import levels from './levels/levels.js';
import WebSocket from 'faye-websocket';

import Users from './users/users.js';

import Rooms from './rooms/rooms.js';

class Network extends EventHandler {
    users = new Users();
    rooms = new Rooms();
    port = 8080;
    reservedMessages = new Set(['room:create', 'room:join', 'room:leave', 'level:save']);

    constructor() {
        super();
    }

    initialize(levelProvider) {
        if (this.server)
            return;

        const handlers = {
            'room:create': async ({ levelId }, user) => {
                try {
                    const room = await this.rooms.create(levelId);
                    const success = this.rooms.join(room.id, user);
                    return { success };
                } catch(ex) {
                    console.log(ex);
                    return { success: false };
                }
            },
            'room:join': this.rooms.join,
            'room:leave': this.rooms.leave,
            'level:save': async (level) => {
                try {
                    await levels.save(level.scene, level);
                    return { success: true };
                } catch(ex) {
                    console.log('unable to save level');
                    console.error(ex);
                    return { success: true };
                }
            }
        };

        global.LevelProvider = levelProvider;

        this.server = createServer();

        this.server.on('upgrade', (request, ws, body) => {
            if (WebSocket.isWebSocket(request)) {
                let socket = new WebSocket(request, ws, body);
                const user = socket.user = this.users.create(socket);

                socket.on('open', (e) => {
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

                        if (!room)
                            return;

                        const player = room.players.getByUserId(user.id);

                        if (!player)
                            return;

                        player.fire(data.name, data.data);
                    }
                });

                socket.on('close', (e) => {
                    console.log('close', e.code, e.reason);
                    user.destroy();
                    socket = null;
                });
            }
        });

        this.server.listen(this.port);
    }

    send(name, data) {
        for (const [_, user] of this.users) {
            user.send(name, data);
        }
    }
}

export default new Network();
