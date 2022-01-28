import { EventHandler } from "playcanvas";

export default class User extends EventHandler {
    constructor(socket, id) {
        super();

        this.id = id;
        this.socket = socket;
        this.rooms = new Map();
    }

    send(name, data, roomId, callbackId) {
        this.socket.send(JSON.stringify({ name, data, roomId, callbackId }));
    }
}
