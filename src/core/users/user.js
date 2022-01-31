import { EventHandler } from "playcanvas";

export default class User extends EventHandler {
    constructor(id, socket) {
        super();

        this.id = id;
        this.socket = socket;
        this.rooms = new Map();
        this.players = new Map();
        this.playerByRoom = new Map();
    }

    onPlayerCreated(player) {
        this.players.set(player.id, player);
        this.rooms.set(player.room.id, player.room);
        this.playerByRoom.set(player.room.id, player);

        player.on('destroy', () => {
            this.players.delete(player.id);
            this.rooms.delete(player.room.id);
            this.playerByRoom.delete(player.room.id);
        });
    }

    send(name, data, roomId, callbackId) {
        this.socket.send(JSON.stringify({ name, data, roomId, callbackId }));
    }

    destroy() {
        this.fire('destroy');
    }
}
