import { EventHandler } from 'playcanvas';
import Room from './room.js';

export default class Rooms extends EventHandler {
    lastRoomId = 1;
    rooms = new Map();

    constructor() {
        super();
    }

    async create(levelId) {
        try {
            const room = new Room(this.lastRoomId++);
            await room.initialize(levelId);
            this.rooms.set(room.id, room);

            room.on('destroy', () => this.rooms.delete(room.id))

            return room;
        } catch(ex) {
            console.log('unable to create room');
            console.error(ex);

            throw ex;
        }
    }

    get(roomId) {
        return this.rooms.get(roomId);
    }

    join(roomId, user) {
        const room = this.rooms.get(roomId);

        if (!room || user.rooms.has(roomId))
            return false;

        room.join(user);
    }

    leave(roomId, user) {
        const room = this.rooms.get(roomId);

        if (!room || !user.rooms.has(roomId))
            return false;

        room.leave(user);
    }
}
