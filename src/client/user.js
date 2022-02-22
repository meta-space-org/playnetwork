/*

Events:

    join (room, player)
    leave (room, player)

Properties:

    id:int
    players:Players
    rooms:Map<Room> (readonly)

Methods:

    getPlayerByRoom(room)

*/

/**
 * @name User
 * @extends pc.EventHandler
 * User is a representation of client connected to the server
 */
class User extends pc.EventHandler {
    constructor() {
        super();

        /**
         * Unique identifier
         */
        this.id = null;


        /**
         * Players related to this user
         * {@link Player}
         */
        this.players = new Map();

        /**
         * Rooms where this user is connected
         */
        this.rooms = new Map();

        this._playerByRoom = new Map();
    }

    /**
     * Get the player by room id
     * @param {Number} roomId
     * @returns {@link Player}
     */
    getPlayerByRoom(roomId) {
        return this._playerByRoom.get(roomId);
    }

    /**
     * Set user's data
     * @param {Object} data
     */
    setData(data) {
        this.id = data.id;
    }
}

