import * as pc from 'playcanvas';

/**
 * @class Users
 * @description Global interface of all {@link User}.
 * It provides events when users are connected and disconnected.
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

        user.send('_self', {
            user: user.toData()
        });

        user.once('disconnect', () => {
            this._index.delete(user.id);
            this.fire('disconnect', user);
        });

        this.fire('connect', user);
    }

    get(id) {
        return this._index.get(id);
    }
}
