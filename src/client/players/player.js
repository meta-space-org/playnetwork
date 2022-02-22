/**
 * Player is a representation of room connection
 * @name Player
 */
class Player extends pc.EventHandler {
    constructor(id, user, room) {
        super();
        user = pn.users.get(user.id) || new User(user.id);

        /**
         * Id
         * @type {number}
         * */
        this.id = id;

        /**
         * User that owns this player
         * @type {User}
         */
        this.user = user;

        /**
         * Room that this player is in
         * @type {Room}
         */
        this.room = room;

        user._addPlayer(this);

        pn.players._add(this);

        this.room.once('destroy', this._destroy, this);
    }

    /**
     * Is this player mine
     * @type {boolean}
     */
    get mine() {
        return this.user.id === pn.users.me.id;
    }

    /**
     *
     * @param {string} name
     * @param {object} data
     * @param {callback} callback
     */
    send(name, data, callback) {
        pn._send(name, data, 'player', this.id, callback);
    }

    _destroy() {
        this.fire('destroy');
        this.off();
    }
}
