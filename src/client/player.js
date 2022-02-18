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

class Player {
    constructor(id, user, room) {
        this.id = id;
        this.user = user;
        this.room = room;

        if (this.mine) {
            pn.user.players.set(id, this);
            pn.user.playerByRoom.set(room.id, this);
        }
    }

    get mine() {
        return this.user.id === pn.user.id;
    }

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
