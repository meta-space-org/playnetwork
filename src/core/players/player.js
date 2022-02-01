import { EventHandler } from 'playcanvas';

let lastPlayerId = 1;

export default class Player extends EventHandler {
    constructor(user, room) {
        super();

        this.id = lastPlayerId++;
        this.user = user;
        this.room = room;
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }

    send(name, data) {
        this.user.send(name, data, this.room.id);
    }
}
