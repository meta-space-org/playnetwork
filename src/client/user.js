/**
 * @class User
 * @classdesc User object that is created for each {@link User} we know,
 * including ourself.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID of a {@link User}.
 * @property {boolean} mine True if {@link User} object is our own.
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
    }

    /**
     * @method send
     * @desctiption Send named message to server User with optional data and a response callback.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean|null} [data] Data for a message, should be a JSON friendly data.
     * @param {messageCallback} callback Callback that will be fired when response is received or on error.
     */
    send(name, data, callback) {
        pn._send(name, data, 'user', this.id, callback);
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }
}
