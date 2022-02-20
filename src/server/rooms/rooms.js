import levels from '../levels/levels.js';
import network from '../network.js';
import Room from './room.js';

class Rooms {
    _rooms = new Map();

    initialize() {
        network.on('_room:create', async (from, { levelId, tickrate, payload }, callback) => {
            if (!Number.isInteger(tickrate) || tickrate < 0) {
                callback(new Error('Tickrate must be a positive integer'));
                return;
            }

            if (!Number.isInteger(levelId) || levelId < 0) {
                callback(new Error('Level ID must be a positive integer'));
                return;
            }

            if (!(await levels.provider.has(levelId))) {
                callback(new Error('Level does not exist'));
                return;
            }

            try {
                const room = await this.create(levelId, tickrate, payload);
                room.join(from);

                callback();
            } catch (ex) {
                console.log('unable to create room');
                console.error(ex);

                throw ex;
            }
        });

        network.on('_room:join', (from, roomId, callback) => {
            const room = this.get(roomId);
            if (!room) {
                callback(new Error(`Room ${roomId} not found`));
                return;
            }

            room.join(from);
            callback();
        });

        network.on('_room:leave', (from, roomId, callback) => {
            const room = this.get(roomId);
            if (!room) {
                callback(new Error(`Room ${roomId} not found`));
                return;
            }

            room.leave(from);
            callback();
        });
    }

    async create(levelId, tickrate, payload) {
        const room = new Room(tickrate, payload);
        await room.initialize(levelId);
        this._rooms.set(room.id, room);

        room.on('destroy', () => this._rooms.delete(room.id));

        return room;
    }

    get(roomId) {
        return this._rooms.get(roomId);
    }

    has(roomId) {
        return this._rooms.has(roomId);
    }
}

export default new Rooms();
