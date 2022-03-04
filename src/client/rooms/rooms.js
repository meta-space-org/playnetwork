/**
 * @class Rooms
 * @classdesc Interface to get {@link Room}s as well as request a {@link Room} create, join and leave.
 * @extends pc.EventHandler
 */

class Rooms extends pc.EventHandler {
    constructor() {
        super();

        this._rooms = new Map();

        pn.on('_room:join', ({ tickrate, players, level, state, roomId }) => {
            if (this.has(roomId)) return;

            const room = new Room(roomId, tickrate, players);
            this._rooms.set(roomId, room);
            room.once('destroy', () => this._rooms.delete(roomId));

            pn.levels._build(room, level);

            room.fire('_state:update', state);
        });

        pn.on('_room:leave', (roomId) => {
            const room = this._rooms.get(roomId);
            if (!room) return;

            pn.levels._clear(roomId);

            this._rooms.delete(roomId);
            room.destroy();
        });
    }

    /**
     * @method create
     * @description Send a request to a server, to create a {@link Room}.
     * @param {object|array|string|number|boolean} data Request data that can be
     * user by Server to decide room creation.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    create(data, callback) {
        pn.send('_room:create', data, (err, data) => {
            if (callback) callback(err, data);
        });
    }

    /**
     * @method join
     * @description Send a request to a server, to join a {@link Room}.
     * @param {number} roomId ID of a {@link Room} to join.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    join(roomId, callback) {
        if (this.has(roomId)) {
            if (callback) callback(`Already joined a Room ${roomId}`);
            return;
        }

        pn.send('_room:join', roomId, (err, data) => {
            if (callback) callback(err, data);
        });
    }

    /**
     * @method leave
     * @description Send a request to a server, to leave a {@link Room}.
     * @param {number} roomId ID of a {@link Room} to leave.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    leave(roomId, callback) {
        if (!this.has(roomId)) {
            if (callback) callback(`Room ${roomId} does not exist`);
            return;
        }

        pn.send('_room:leave', roomId, (err, data) => {
            if (callback) callback(err, data);
        });
    }

    /**
     * @method get
     * @description Get {@link Room} by numerical ID.
     * @param {number} id
     * @returns {Room|null}
     */
    get(id) {
        return this._rooms.get(id) || null;
    }

    /**
     * @method has
     * @description Check if we are joined to a {@link Room} by numerical ID.
     * @param {number} id
     * @returns {boolean}
     */
    has(id) {
        return this._rooms.has(id);
    }
}
