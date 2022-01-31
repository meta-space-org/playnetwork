import { EventHandler } from 'playcanvas';

export default class Player extends EventHandler {
    constructor(id, user, room) {
        super();

        this.id = id;
        this.user = user;
        this.room = room;

        this.user.onPlayerCreated(this);
    }

    destroy() {
        this.send('room:left');

        this.fire('destroy');
    }

    send(name, data) {
        this.user.send(name, data, this.room.id);
    }
}
