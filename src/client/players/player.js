/**
 * @class Player
 * @classdesc Player represents a pair of joined a {@link User} and {@link Room}.
 * So each {@link User} has as many {@link Player}s as rooms {@link Room}s
 * it has joined.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID of a {@link Player}.
 * @property {User} user {@link User} that this {@link Player} belongs to.
 * @property {Room} room {@link Room} that this {@link Player} associated with.
 * @property {boolean} mine True if this {@link Player} belongs to our own {@link User}.
 */

/**
 * @event Player#destroy
 * @description Fired when {@link Player} has been destroyed.
 */

class Player extends pc.EventHandler {
    constructor(id, user, room) {
        super();

        this.id = id;
        this.user = user;
        this.room = room;

        // add to indexes
        user.players.add(player);
        room.players.add(player);
        pn.players.set(id, player);

        this.room.once('destroy', this.destroy, this);
    }

    get mine() {
        return this.user.me;
    }

    /**
     * @method send
     * @description Send a named message to a {@link Player}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Data of a message.
     * Must be JSON friendly data.
     * @param {callback} [callback] Response callback, which is called when
     * client receives server response for this specific message.
     */
    send(name, data, callback) {
        pn._send(name, data, 'player', this.id, callback);
    }

    destroy() {
        // remove from indexes
        this.user.players.delete(this);
        this.room.players.delete(this);
        pn.players.delete(this.id);

        this.fire('destroy');
        this.off();
    }
}
