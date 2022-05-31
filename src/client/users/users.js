/**
 * @class Users
 * @classdesc Interface to access all known {@link User}s as well as own user (`me`).
 * @property {User} me {@link User} object that belongs to our current session.
 */

class Users {
    constructor() {
        this.me = null;
        this._users = new Map();
    }

    /**
     * @method get
     * @description Get {@link User} by ID.
     * @param {number} id ID of a {@link User}.
     * @returns {User|null} Return {@link User} or `null` if it is not known.
     */
    get(id) {
        return this._users.get(id);
    }

    /**
     * @method has
     * @description Check if {@link User} is known.
     * @param {number} id ID of a {@link User}.
     * @returns {boolean} True if {@link User} is known.
     */
    has(id) {
        return this._users.has(id);
    }

    add(user) {
        if (this._users.has(user.id)) return;

        this._users.set(user.id, user);
        user.once('destroy', () => this._users.delete(user.id));

        if (!user.mine) return;
        this.me = user;
    }
}
