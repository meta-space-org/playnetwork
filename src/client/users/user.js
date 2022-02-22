class User extends pc.EventHandler {
    constructor(id, mine) {
        super();

        this.id = id;
        this.players = new Players();
        this.rooms = new Map();
        this.playerByRoom = new Map();
        this.mine = mine;

        pn.users._add(this);
    }

    getPlayerByRoom(roomId) {
        return this.playerByRoom.get(roomId);
    }

    _addPlayer(player) {
        this.players._add(player);
        this.playerByRoom.set(player.room.id, player);

        player.once('destroy', () => {
            this.playerByRoom.delete(player.room.id);
            this.fire('leave', player.room, player);

            if (this.mine || this.playerByRoom.size > 0) return;
            this._destroy();
        });

        this.fire('join', player.room, player);
    }

    _destroy() {
        this.fire('destroy');
        this.off();
    }
}

/**
 * User join to room
 *
 * @event User#join
 * @type {object}
 * @property {Room} room
 * @property {Player} player
 */

/**
 * User leave from room
 *
 * @event User#leave
 * @type {object}
 * @property {Room} room
 * @property {Player} player
 */

/**
 * Destroyed
 *
 * @event User#destroy
 * @type {object}
 */
