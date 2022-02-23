import { EventHandler } from 'playcanvas';
import Players from '../players/players.js';

/**
 * TODO
 * @name User
 * @property {number} id
 * @property {Map} rooms
 * @property {Players} players
 */

/**
 * @event User#destroy
 * @type {object}
 * @description TODO
 */
export default class User extends EventHandler {
    static _lastId = 1;

    constructor(socket) {
        super();

        this.id = User._lastId++;
        this.socket = socket;
        this.rooms = new Map();
        this.players = new Players();
    }

    /**
     * TODO
     * @param {string} name
     * @param {*} data
     */
    send(name, data) {
        this._send(name, data, 'user');
    }

    _send(name, data, scope, id, msgId) {
        scope = {
            type: scope,
            id: id
        };

        this.socket.send(JSON.stringify({ name, data, scope, id: msgId }));
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

        this.socket = null;
        this.rooms = null;
        this.players = null;

        this.fire('destroy');
        this.off();
    }
}
