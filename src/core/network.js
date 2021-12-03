import { readFileSync } from 'fs';

import { createServer } from 'https';
import { Server } from 'socket.io';

import GameRoom from '../game-example/game-room.js';

export default class Network {
    savedLevel = null;
    rooms = new Map();

    constructor() {
        const options = {
            key: readFileSync('privkey.pem', 'utf8'),
            cert: readFileSync('cert.pem', 'utf8'),
            ca: readFileSync('chain.pem', 'utf8'),
        };

        const httpServer = createServer(options);
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        });

        httpServer.listen(8080);

        this.initialize();
    }

    initialize() {
        this.io.on('connection', socket => {
            this.initializeEvents(socket);

            socket.on('disconnecting', () => {
                socket.rooms.forEach(async r => {
                    const room = this.rooms.get(r);

                    if (room)
                        await room.onLeftRoom(socket);
                });
            });
        });
    }

    initializeEvents(socket) {
        socket.on('room:create', async (callback) => {
            const room = new GameRoom(this.io.engine.generateId());
            this.rooms.set(room.id, room);

            await room.onCreateRoom(socket);

            if (callback)
                callback(room.id);
        });

        socket.on('room:join', async (roomId, callback) => {
            const room = this.rooms.get(roomId);

            if (!room || socket.rooms.has(roomId))
                return;

            socket.join(room.id);

            const data = await room.onJoinRoom(socket);

            if (callback)
                callback(data);

            const joinedPlayer = room.players.get(socket.id);
            room.createdEntities.forEach(e => socket.emit('entity:create', e));
            room.createPlayerEntity(joinedPlayer);
        });

        socket.on('room:leave', async (roomId, callback) => {
            const room = this.rooms.get(roomId);

            if (!room || !socket.rooms.has(roomId))
                return;

            socket.leave(roomId);
            const data = await room.onLeftRoom(socket);

            if (callback)
                callback(data);
        });

        socket.on('level:save', async (level, callback) => {
            this.savedLevel = level;
            callback("Level saved!");
        });
    }
}
