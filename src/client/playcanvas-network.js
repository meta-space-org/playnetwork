/*



{
    name: 'fire',
    scope: {
        type: 'user',
        id: 123
    },
    from: {
        type: 'player',
        id: 123
    }
    data: ...
}

// room send
room.send(name, data)

{
    name: 'fire',
    scope: {
        type: 'room',
        id: 123
    },
    from: {
        type: 'user',
        id: 124
    }
    data: ...
}


let user = pn.users.get(from.id);
user.players.

// user send
user.send(name, data)

{
    name: 'fire',
    scope: {
        type: 'user',
        id: 123
    },
    from: {
        type: 'user',
        id: 124
    }
    data: ...
}

*/

import './user.js';
import './rooms/room.js';
import './rooms/rooms.js';
import './levels.js';
import './templates.js' ;
import './player.js';
import './interpolation.js';

/**
 * @callback callback
 * @param {string} error
 * @param {object} data
 */

/**
 * PlayCanvas Network
 * @extends pc.EventHandler
 * @name PlayCanvasNetwork
 */
class PlayCanvasNetwork extends pc.EventHandler {
    constructor() {
        super();

        this._lastCallbackId = 1;
        this._callbacks = new Map();
    }

    initialize() {
        /**
        * User
        * @type {User}
        */
        this.user = new User();

        /**
         * Rooms
         * @type {Rooms}
         */
        this.rooms = new Rooms();

        /**
         * Levels manager
         * @type {Levels}
         */
        this.levels = new Levels();

        /**
         * Acknowledged players
         * @type {Map<number, Player>}
         */
        this.players = new Map();

        /**
         * Templates
         * @type {Templates}
         */
        this.templates = new Templates();

        this.on('_self', (data) => {
            pn.user.setData(data.user);
        });
    }

    /**
     * Create websocket connection
     */
    connect() {
        this.socket = new WebSocket('ws://localhost:8080');

        this.socket.onmessage = (e) => {
            const msg = JSON.parse(e.data);

            if (msg.callbackId) {
                const callback = this._callbacks.get(msg.callbackId);

                if (!callback) {
                    console.warn(`No callback with id - ${msg.callbackId}`);
                    return;
                }

                callback(msg.data?.err, msg.data);
                this._callbacks.delete(msg.callbackId);
            }

            if (msg.data?.err) {
                console.warn(msg.data.err);
                return;
            }

            if (msg.callbackId) return;

            if (msg.roomId) {
                const room = this.rooms.get(msg.roomId);
                if (room) {
                    room.fire(msg.name, msg.data);
                }
            }

            this.fire(msg.name, msg.data, msg.roomId);
        };

        this.socket.onopen = () => console.log('connect');
        this.socket.onclose = () => console.log('disconnect');
        this.socket.onerror = console.error;
    }

    /**
     * Send message to server
     * @param {string} name
     * @param {object} data
     * @param {callback} callback
     */
    send(name, data, callback) {
        this._send(name, data, 'user', null, callback);
    }

    _send(name, data, scope, id, callback) {
        const msg = {
            name,
            scope: {
                type: scope,
                id: id
            },
            data
        };

        if (callback) {
            msg.callbackId = this._lastCallbackId;
            this.callbacks.set(this._lastCallbackId, callback);
            this._lastCallbackId++;
        }

        this.socket.send(JSON.stringify(msg));
    }
}

window.pn = new PlayCanvasNetwork();
window.pn.initialize();
