/**
 * TODO: Players collection
 * @name Players
 */
class Players extends pc.EventHandler {
    constructor() {
        super();

        this._index = new Map();
    }

    /**
     * TODO: Get player by id
     * @param {number} id
     * @returns {Player|null}
     */
    get(id) {
        return this._index.get(id);
    }

    /**
     * TODO: Is player exist
     * @param {number} id
     * @returns {boolean}
     */
    has(id) {
        return this._index.has(id);
    }

    add(player) {
        if (this._index.has(player.id)) return;

        this._index.set(player.id, player);
        player.once('destroy', () => {
            this._index.delete(player.id)
            this.fire('remove', player);
        });

        this.fire('add', player);
    }

    static create(id, user, room) {
        const player = new Player(id, user, room);

        user.players.add(player);
        room.players.add(player);
        pn.players.add(player);

        return player;
    }
}
