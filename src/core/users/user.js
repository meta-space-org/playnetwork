import { EventHandler } from 'playcanvas';
import Players from '../players/players.js';

let lastUserId = 1;

export default class User extends EventHandler {
    constructor(socket) {
        super();

        this.id = lastUserId++;
        this.socket = socket;
        this.rooms = new Map();
        this.players = new Players();
    }

    toData() {
        return {
            id: this.id
        };
    }

    destroy() {
        for (const [_, room] of this.rooms) {
            room.leave(this);
        }

        for (const [_, player] of this.players) {
            player.destroy();
        }

        this.socket = null;
        this.rooms = null;
        this.players = null;

        this.fire('destroy');
        this.off();
    }

    send(name, data, roomId, callbackId) {
        this.socket.send(JSON.stringify({ name, data, roomId, callbackId }));
    }
}
