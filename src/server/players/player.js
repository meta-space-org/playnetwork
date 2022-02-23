import { EventHandler } from 'playcanvas';

/**
 * @name Player
 * @property {number} id
 * @property {User} user
 * @property {Room} room
 */

/**
 * @event Player#destroy
 * @type {object}
 * @description TODO
 */
export default class Player extends EventHandler {
    static _lastId = 1;

    constructor(user, room) {
        super();

        this.id = Player._lastId++;
        this.user = user;
        this.room = room;

        this.user.once('destroy', this.destroy, this);
    }

    /**
     * TODO
     * @param {string} name
     * @param {*} data
     */
    send(name, data) {
        this.user._send(name, data, 'player', this.id);
    }

    toData() {
        return {
            id: this.id,
            userData: this.user.toData()
        };
    }

    destroy() {
        this.fire('destroy');
        this.off();
    }
}
