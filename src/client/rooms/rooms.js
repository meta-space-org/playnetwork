/**
 * Rooms
 * @name Rooms
 */
class Rooms extends pc.EventHandler {
    constructor() {
        super();

        this._rooms = new Map();

        pn.on('_room:join', ({ level, tickrate, payload, players, state }, roomId) => {
            if (this.has(roomId)) return;

            const room = new Room(roomId, tickrate, payload, players);
            this._rooms.set(roomId, room);
            room.on('destroy', () => this._rooms.delete(roomId));

            pn.levels._build(room, level);

            room.fire('_state:update', state);
        });

        pn.on('_room:leave', (_, roomId) => {
            const room = this._rooms.get(roomId);
            if (!room) return;

            pn.levels._clear(roomId);

            this._rooms.delete(roomId);
            room._destroy();

            pn.users.me.fire('leave', room);
        });
    }

    /**
     * Create room
     *
     * @param {number} levelId
     * @param {number} tickrate
     * @param {*} payload
     * @param {callback} callback
     */
    create(levelId, tickrate, payload, callback) {
        pn.send('_room:create', { levelId, tickrate, payload }, (err) => {
            if (callback) callback(err);
        });
    }

    /**
     * Join room
     *
     * @param {number} roomId
     * @param {callback} callback
     */
    join(roomId, callback) {
        if (this.has(roomId)) return;

        pn.send('_room:join', roomId, (err) => {
            if (callback) callback(err);
        });
    }

    /**
     * Leave room
     *
     * @param {number} roomId
     * @param {callback} callback
     */
    leave(roomId, callback) {
        if (!this.has(roomId)) return;

        pn.send('_room:leave', roomId, (err) => {
            if (callback) callback(err);
        });
    }

    /**
     * Get room
     *
     * @param {number} id
     */
    get(id) {
        return this._rooms.get(id);
    }

    /**
     * Has room
     *
     * @param {number} id
     */
    has(id) {
        return this._rooms.has(id);
    }
}
