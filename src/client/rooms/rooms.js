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

        pn.on('_room:join', ({ level, tickrate, payload, players, state }, roomId) => {
            if (this.has(roomId)) return;

            const room = new Room(roomId, tickrate, payload);
            this._rooms.set(roomId, room);
            pn.user.rooms.set(roomId, room);

            for (const key in players) {
                const { id, user } = players[key];
                const player = new Player(id, user, room);
                room.players.set(id, player);
                pn.players.set(id, player);
            }

            pn.levels.build(room, level);
            pn.user.fire('join', room);

            room.fire('_state:update', state);

            console.log('Room joined:', roomId);
        });

        pn.on('_room:leave', (_, roomId) => {
            const room = this._rooms.get(roomId);
            if (!room) return;

            pn.levels.clear(roomId);

            this._rooms.delete(roomId);
            room._destroy();

            pn.user.fire('leave', room);

            console.log('Room leave:', roomId);
        });
    }

    create(levelId, tickrate, payload, callback) {
        pn.send('_room:create', { levelId, tickrate, payload }, (err) => {
            if (callback) callback(err);
        });
    }

    join(roomId, callback) {
        if (this.has(roomId)) return;

        pn.send('_room:join', roomId, (err) => {
            if (callback) callback(err);
        });
    }

    leave(roomId, callback) {
        if (!this.has(roomId)) return;

        pn.send('_room:leave', roomId, (err) => {
            if (callback) callback(err);
        });
    }

    get(roomId) {
        return this._rooms.get(roomId);
    }

    has(roomId) {
        return this._rooms.has(roomId);
    }
}
