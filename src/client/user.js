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

class User extends pc.EventHandler {
    constructor() {
        super();

        this.id = null;
        this.players = new Map();
        this.rooms = new Map();
    }

    setData(data) {
        this.id = data.id;
    }
}
