/**
 * Players collection
 * @name Players
 */
class Players {
    constructor() {
        this._players = new Map();
    }

    /**
     * Get player by id
     * @param {number} id
     * @returns {Player|null}
     */
    get(id) {
        return this._players.get(id);
    }

    /**
     * Is player exist
     * @param {number} id
     * @returns {boolean}
     */
    has(id) {
        return this._players.has(id);
    }

    _add(player) {
        if (this._players.has(player.id)) return;

        this._players.set(player.id, player);
        player.on('destroy', () => this._players.delete(player.id));
    }
}
