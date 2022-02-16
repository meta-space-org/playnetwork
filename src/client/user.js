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

export default class User extends pc.EventHandler {
    constructor() {
        super();

        this.id = null;
        this.players = new Map();
        this.rooms = new Map();
        this.playerByRoom = new Map();
    }

    getPlayerByRoom(roomId) {
        return this.playerByRoom.get(roomId);
    }

    setData(data) {
        this.id = data.id;
    }
}

