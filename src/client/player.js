/*

Events:

    leave (room)

Properties:

    id:int
    user:User
    room:Room
    mine:boolean (readonly)

Methods:

    send(name, data, callback)

*/

/**
 * Player is a representation of room connection
 * @name Player
 */
class Player {
    constructor(id, user, room) {
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

        if (this.mine) {
            pn.user.players.set(id, this);
            pn.user.playerByRoom.set(room.id, this);
        }
    }

    /**
     * Is this player mine
     * @type {boolean}
     */
    get mine() {
        return this.user.id === pn.user.id;
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

    destroy() {
        pn.players.delete(this.id);

        if (this.mine) {
            pn.user.players.delete(this.id);
            pn.user.rooms.delete(this.room.id);
            pn.user.playerByRoom.delete(this.id);
        }
    }
}
