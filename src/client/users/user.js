/**
 * TODO: USER
 * @name User
 * @property {number} id
 * @property {Players} players
 * @property {Map} rooms
 * @property {boolean} mine
 */

/**
 * @event User#join
 * @type {object}
 * @description TODO
 * @property {Room} room
 * @property {Player} player
 */

/**
 * @event User#leave
 * @type {object}
 * @description TODO
 * @property {Room} room
 * @property {Player} player
 */

/**
 * @event User#destroy
 * @type {object}
 * @description TODO
 */
class User extends pc.EventHandler {
    constructor(id, mine) {
        super();

        this.id = id;
        this.players = new Players();
        this.rooms = new Map();
        this.mine = mine;
        this._playerByRoom = new Map();

        pn.users.add(this);

        this.players.on('add', (player) => {
            this._playerByRoom.set(player.room.id, player);

            player.once('destroy', () => {
                this._playerByRoom.delete(player.room.id);
                this.fire('leave', player.room, player);

                if (this.mine || this._playerByRoom.size > 0) return;
                this.destroy();
            });

            this.fire('join', player.room, player);
        });
    }

    /**
     * TODO
     * @param {number} roomId
     * @returns {Player}
     */
    getPlayerByRoom(roomId) {
        return this._playerByRoom.get(roomId);
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }
}
