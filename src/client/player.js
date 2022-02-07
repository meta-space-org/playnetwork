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
    constructor(id, user, roomId) {
        this.id = id;
        this.user = user;
        this.roomId = roomId;

        if (this.mine) {
            pn.user.players.set(id, this);
        }
    }

    get mine() {
        return this.user.id === pn.user.id;
    }

    send(name, data, callback) {
        pn._send(name, data, this.roomId, callback);
    }

    destroy() {
        pn.players.delete(this.id);

        if (this.mine) {
            pn.user.players.delete(this.id);
        }
    }
}
