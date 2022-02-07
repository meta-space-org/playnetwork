/*

Events:

    join (room, player)
    leave (room, player)

Properties:

    

Methods:

    <iteratable>
    create(levelId, callback)
    join(roomId, callback)
    has(roomId)
    get(roomId)

*/

class Rooms extends pc.EventHandler {
    constructor() {
        super();

        this._rooms = new Map();

        pn.on('_room:join', ({ level, players }, roomId) => {
            if (this.has(roomId)) return;

            const room = new Room(roomId);
            this._rooms.set(roomId, room);

            for (const key in players) {
                const { id, user } = players[key];
                const player = new Player(id, user, room.id);
                room.players.set(id, player);
                pn.players.set(id, player);
            }

            pn.levels.build(room, level);
            pn.user.fire('join', room);

            console.log('Room joined:', roomId);
        });

        pn.on('_room:leave', (_, roomId) => {
            const room = this._rooms.get(roomId);
            if (!room) return;

            room.destroy();
            this._rooms.delete(roomId);

            pn.levels.clear(roomId);
            pn.user.fire('leave', room);

            console.log('Room leave:', roomId);
        });
    }

    create(levelId, callback) {
        pn.send('_room:create', { levelId }, callback);
    }

    join(roomId, callback) {
        if (this.has(roomId)) return;

        pn.send('_room:join', roomId, (data) => {
            const room = new Room(data.id);
            this._rooms.set(data.id, room);
            pn.levels.build(room, data.level);
            if (callback) callback(room);
        });
    }

    get(roomId) {
        return this._rooms.get(roomId);
    }

    has(roomId) {
        return this._rooms.has(roomId);
    }
}