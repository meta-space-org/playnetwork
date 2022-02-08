import { EventHandler } from 'playcanvas';

let lastPlayerId = 1;

export default class Player extends EventHandler {
    constructor(user, room) {
        super();

        this.id = lastPlayerId++;
        this.user = user;
        this.room = room;
    }

    toData() {
        return {
            id: this.id,
            user: this.user.toData()
        };
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }

    send(name, data, callbackId) {
        this.user.send(name, data, this.room.id, callbackId);
    }
}
