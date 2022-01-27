import { EventHandler } from "playcanvas";

export default class User extends EventHandler {
    constructor(ws, id) {
        super();

        this.id = id;
        this.ws = ws;
        this.rooms = new Map();
    }

    send(name, data, roomId) {
        this.ws.send(JSON.stringify({ name, data, roomId }));
    }
}
