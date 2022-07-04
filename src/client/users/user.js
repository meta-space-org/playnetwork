/**
 * @class User
 * @classdesc User object that is created for each {@link User} we know,
 * including ourself.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID of a {@link User}.
 * @property {Set<Room>} rooms List of {@link Room}s that {@link User} has joined to.
 * @property {boolean} mine True if {@link User} object is our own.
 */

/**
 * @event User#join
 * @description Fired when {@link User} has joined a {@link Room}.
 * @param {Room} room To which {@link User} has joined.
 */

/**
 * @event User#leave
 * @description Fired when a {@link User} left a {@link Room}.
 * @param {Room} room From which {@link User} has left.
 */

/**
 * @event User#destroy
 * @description Fired when {@link User} has been destroyed
 * (not known to client anymore).
 */

class User extends pc.EventHandler {
    constructor(id, mine) {
        super();

        this.id = id;
        this.mine = mine;

        pn.users.add(this);
    }

    send(name, data, callback) {
        pn._send(name, data, 'user', this.id, callback);
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }
}
