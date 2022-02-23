/**
 * TODO: Player is a representation of room connection
 * @name Player
 * @property {number} id
 * @property {User} user that owns this player
 * @property {Room} room that this player is in
 * @property {boolean} is this player mine
 */

/**
 * @event Player#destroy
 * @description TODO
 * @type {object}
 */
class Player extends pc.EventHandler {
    constructor(id, user, room) {
        super();

        this.id = id;
        this.user = user;
        this.room = room;

        this.room.once('destroy', this.destroy, this);
    }

    get mine() {
        return this.user.id === pn.users.me.id;
    }

    /**
     * TODO
     * @param {string} name
     * @param {object} data
     * @param {callback} callback
     */
    send(name, data, callback) {
        pn._send(name, data, 'player', this.id, callback);
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }
}
