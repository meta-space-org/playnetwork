import { createServer } from 'http';
import { Server } from 'socket.io';

import levels from './levels.js';
import templates from './templates.js';
import Room from './room.js';
import User from './user.js';

class Network {
    rooms = new Map();
    port = 8080;
    roomIds = 0;

    constructor() { }

    initialize(levelProvider, onBeforeConnection) {
        if (this.io)
            return;

        global.LevelProvider = levelProvider;

        // const options = {
        //     key: readFileSync('privkey.pem', 'utf8'),
        //     cert: readFileSync('cert.pem', 'utf8'),
        //     ca: readFileSync('chain.pem', 'utf8'),
        // };

        const httpServer = createServer();
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        });
        httpServer.listen(this.port);

        if (onBeforeConnection)
            this.io.use(onBeforeConnection);

        this.io.on('connection', (socket) => {
            const user = socket.user = new User(socket, socket.id, socket.data);

            socket.on('disconnecting', () => {
                user.rooms.forEach((room) => {
                    room.leave(user);
                });
            });

            // send basic information to connected user
            user.send('self', {
                userId: user.id,
                data: user.data,
                templates: templates.toData()
            });

            socket.on('room:create', async (levelId, roomType, callback) => {
                const roomId = ++this.roomIds;

                try {
                    const room = new Room(roomId, roomType, user);
                    await room.initialize(levelId);
                    this.rooms.set(room.id, room);

                    this.roomJoin(room.id, user, callback);
                } catch(ex) {
                    this.rooms.delete(roomId);

                    console.log('unable to create room');
                    console.error(ex);

                    if (callback) callback({ success: false });
                }
            });

            socket.on('room:join', (roomId, callback) => {
                this.roomJoin(roomId, user, callback);
            });

            socket.on('room:leave', async (roomId, callback) => {
                const room = this.rooms.get(roomId);

                if (!room || !socket.rooms.has(roomId))
                    return;

                socket.leave(roomId);
                room.leave(user);

                if (callback) callback({ success: true });
            });

            socket.on('level:save', async (level, callback) => {
                try {
                    await levels.save(level.scene, level);
                    if (callback) callback({ success: true });
                } catch(ex) {
                    console.log(`unable to save level`);
                    console.error(ex);
                    if (callback) callback({ success: false });
                }
            });
        });
    }

    roomJoin(roomId, user, callback) {
        const room = this.rooms.get(roomId);

        if (!room || user.rooms.has(roomId)) {
            if (callback) callback({ success: false });
            return;
        }

        user.socket.join(room.id);
        room.join(user);

        if (callback) callback({ success: true });
    }
}

export default new Network();
