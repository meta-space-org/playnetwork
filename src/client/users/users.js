/**
 * Users
 * @name Users
 */
class Users extends pc.EventHandler {
    constructor() {
        super();

        /**
         * My user
         * @property {User} me
         */
        this.me = null;
        this._users = new Map();
    }

    /**
     * Get user by id
     * @param {number} id
     * @returns {User|null}
     */
    get(id) {
        return this._users.get(id);
    }

    /**
     * Is user exist
     * @param {number} id
     * @returns {boolean}
     */
    has(id) {
        return this._users.has(id);
    }

    _add(user) {
        if (this._users.has(user.id)) return;

        this._users.set(user.id, user);
        user.on('destroy', () => this._users.delete(user.id));

        if (!user.mine) return;
        this.me = user;
    }
}
