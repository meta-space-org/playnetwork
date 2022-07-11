import * as pc from 'playcanvas';
import pn from './../index.js';
import User from './user.js';

/**
 * @class Users
 * @classdesc Interface of all {@link User}s, currently connected to a {@link Node}.
 * It provides events when users are connected and disconnected.
 * @extends pc.EventHandler
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
        }

        return this._index.get(id);
    }
}
