import * as pc from 'playcanvas';

/**
 * @class Users
 * @classdesc Global interface of all {@link User}s.
 * It provides events when users are connected and disconnected.
 * @extends pc.EventHandler
 */

/**
 * @event Users#connect
 * @property {User} user
 * @description Fired when new user has been connected.
 */

/**
 * @event Users#disconnect
 * @property {User} user
 * @description Fired when a user has been disconnected.
 */

export default class Users extends pc.EventHandler {
    _index = new Map();

    add(user) {
        this._index.set(user.id, user);

        user.once('disconnect', () => {
            this._index.delete(user.id);
            this.fire('disconnect', user);
        });

        this.fire('connect', user);
    }

    /**
     * @method get
     * @description Get user by ID
     * @param {number} id
     * @returns {User|null}
     */
    get(id) {
        return this._index.get(id) || null;
    }
}
