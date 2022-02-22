class Users extends pc.EventHandler {
    constructor() {
        super();

        this.me = null;
        this._users = new Map();
    }

    get(id) {
        return this._users.get(id);
    }

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
