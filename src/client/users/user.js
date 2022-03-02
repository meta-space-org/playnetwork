/**
 * @class User
 * @classdesc User object that is created for each {@link User} we know,
 * including ourself.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID of a {@link User}.
 * @property {Set<Room>} rooms List of {@link Room}s that {@link User} has joined to.
 * @property {Set<Player>} players List of {@link Player}s that is associated with
 * this {@link User} and joined {@link Room}s.
 * @property {boolean} me True if {@link User} object is our own.
 */

/**
 * @event User#join
 * @description Fired when {@link User} has joined a {@link Room}.
 * @param {Room} room To which {@link User} has joined.
 * @param {Player} player {@link Player} object that is created for this
 * {@link User} - {@link Room} pair.
 */

/**
 * @event User#leave
 * @description Fired when a {@link User} left a {@link Room}.
 * @param {Room} room From which {@link User} has left.
 * @param {Player} player {@link Player} object that was associated with
 * that {@link User} and a {@link Room}.
 */

/**
 * @event User#destroy
 * @description Fired when {@link User} has been destroyed
 * (not known to client anymore).
 */

class User extends pc.EventHandler {
    constructor(id, me) {
        super();

        this.id = id;
        this.rooms = new Set();
        this.players = new Set();
        this._playersByRoom = new Map();
        this.me = me;

        pn.users.add(this);
    }

    addPlayer(player) {
        const room = player.room;

        this.rooms.add(room);
        this.players.add(player);
        this._playersByRoom.set(room, player);

        player.once('destroy', () => {
            this.rooms.delete(room);
            this.players.delete(player);
            this._playersByRoom.delete(room);
            this.fire('leave', room, player);

            if (this.me || this._playersByRoom.size > 0) return;
            this.destroy();
        });

        this.fire('join', room, player);
    }

    /**
     * @method getPlayerByRoom
     * @description Get {@link Player} object of this {@link User} by {@link Room}.
     * @param {Room} room
     * @returns {Player|null}
     */
    getPlayerByRoom(room) {
        return this._playersByRoom.get(room) || null;
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }
}
