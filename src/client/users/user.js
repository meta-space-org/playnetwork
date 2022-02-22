class User extends pc.EventHandler {
    constructor(id, mine) {
        super();

        this.id = id;
        this.players = new Players();
        this.rooms = new Map();
        this.playerByRoom = new Map();
        this.mine = mine;

        pn.users._add(this);
    }

    getPlayerByRoom(roomId) {
        return this.playerByRoom.get(roomId);
    }

    _addPlayer(player) {
        this.players.add(player);
        this.playerByRoom.set(player.room.id, player);

        player.once('destroy', () => {
            this.playerByRoom.delete(player.room.id);
            this.fire('leave', player.room);

            if (this.mine || this.playerByRoom.size > 0) return;
            this._destroy();
        });

        this.fire('join', player.room);
    }

    _destroy() {
        this.fire('destroy');
        this.off();
    }
}

