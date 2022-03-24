/**
 * @class Rooms
 * @classdesc Interface to get {@link Room}s as well as request a {@link Room} create, join and leave.
 * @extends pc.EventHandler
 */

class Rooms extends pc.EventHandler {
    constructor() {
        super();

        this._rooms = new Map();

        pn.on('_room:join', ({ tickrate, players, level, state, id }) => {
            if (this.has(id)) return;

            const room = new Room(id, tickrate, players);
            this._rooms.set(id, room);
            room.once('destroy', () => this._rooms.delete(id));

            pn.levels._build(room, level);

            room.fire('_state:update', state);
        });

        pn.on('_room:leave', (id) => {
            const room = this._rooms.get(id);
            if (!room) return;

            pn.levels._clear(id);

            this._rooms.delete(id);
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
     * @param {number} id ID of a {@link Room} to join.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    join(id, callback) {
        if (this.has(id)) {
            if (callback) callback(`Already joined a Room ${id}`);
            return;
        }

        pn.send('_room:join', id, (err, data) => {
            if (callback) callback(err, data);
        });
    }

    /**
     * @method leave
     * @description Send a request to a server, to leave a {@link Room}.
     * @param {number} id ID of a {@link Room} to leave.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    leave(id, callback) {
        if (!this.has(id)) {
            if (callback) callback(`Room ${id} does not exist`);
            return;
        }

        pn.send('_room:leave', id, (err, data) => {
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
