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

class Player extends pc.EventHandler {
    constructor(id, user, room) {
        super();

        user = pn.users.get(user.id) || new User(user.id);

        this.id = id;
        this.user = user;
        this.room = room;

        user._addPlayer(this);

        pn.players.add(this);

        this.room.once('destroy', this._destroy, this);
    }

    get mine() {
        return this.user.id === pn.users.me.id;
    }

    send(name, data, callback) {
        pn._send(name, data, 'player', this.id, callback);
    }

    _destroy() {
        this.fire('destroy');
        this.off();
    }
}
