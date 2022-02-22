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

import './players/player.js';
import './players/players.js';
import './users/user.js';
import './users/users.js';
import './rooms/room.js';
import './rooms/rooms.js';
import './levels.js';
import './templates.js';
import './interpolation.js';

class Network extends pc.EventHandler {
    constructor() {
        super();

        this.lastCallbackId = 1;
        this.callbacks = new Map();
    }

    initialize() {
        this.users = new Users();
        this.rooms = new Rooms();
        this.levels = new Levels();
        this.players = new Players();
        this.templates = new Templates();
    }

    connect(callback) {
        this.socket = new WebSocket('ws://localhost:8080');

        this.socket.onmessage = (e) => this._onMessage(e.data);
        this.socket.onopen = () => console.log('connect');
        this.socket.onclose = () => console.log('disconnect');
        this.socket.onerror = console.error;

        this.once('_self', (data) => {
            callback(new User(data.user.id, true));
        });
    }

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
            msg.callbackId = this.lastCallbackId;
            this.callbacks.set(this.lastCallbackId, callback);
            this.lastCallbackId++;
        }

        this.socket.send(JSON.stringify(msg));
    }

    _onMessage(data) {
        const msg = JSON.parse(data);

        if (msg.callbackId) {
            const callback = this.callbacks.get(msg.callbackId);

            if (!callback) {
                console.warn(`No callback with id - ${msg.callbackId}`);
                return;
            }

            callback(msg.data?.err, msg.data);
            this.callbacks.delete(msg.callbackId);
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
    }
}

window.pn = new Network();
window.pn.initialize();
