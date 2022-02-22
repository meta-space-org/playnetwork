class Players {
    constructor() {
        this._players = new Map();
    }

    add(player) {
        if (this._players.has(player.id)) return;

        this._players.set(player.id, player);
        player.on('destroy', () => this._players.delete(player.id));
    }

    get(id) {
        return this._players.get(id);
    }

    has(id) {
        return this._players.has(id);
    }
}
