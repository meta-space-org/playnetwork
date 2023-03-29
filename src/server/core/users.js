import * as pc from 'playcanvas';
import pn from './../index.js';
import User from './user.js';

/**
 * @class Users
 * @classdesc Interface of all {@link User}s currently connected to a server. As well as for handling new user authentication.
 * @extends pc.EventHandler
 */

/**
 * @callback authenticateCallback
 * @param {Error} [error] {@link Error} object if authentication failed.
 * @param {number|string} userId User ID if authentication succeeded.
 */

/**
 * @event Users#connect
 * @description Fired when new user has been connected.
 * @param {User} user
 */

/**
 * @event Users#disconnect
 * @description Fired when a user has been disconnected.
 * @param {User} user
 */

/**
 * @event Users#authenticate
 * @description Event to handle new connected sockets and authenticate a user. Callback should be called with an error or userId provided.
 * @param {object|array|string|number|boolean} payload Payload data sent from a client.
 * @param {authenticateCallback} callback Callback that should be called when authentication is finished. By providing userId - authentication considered successfull.
 */

export default class Users extends pc.EventHandler {
    _index = new Map();

    add(user) {
        this._index.set(user.id, user);

        user.once('destroy', () => {
            this._index.delete(user.id);
            this.fire('disconnect', user);
        });

        this.fire('connect', user);
    }

    /**
     * @method get
     * @description Get {@link User} by ID
     * @param {number} id
     * @returns {User|null}
     */
    async get(id) {
        if (!this._index.has(id)) {
            const serverId = parseInt(await pn.redis.HGET('_route:user', id.toString()));
            if (!serverId) return null;

            const user = new User(id, null, serverId);
            this._index.set(user.id, user);

            user.once('destroy', () => {
                this._index.delete(user.id);
            });
        }

        return this._index.get(id);
    }
}
