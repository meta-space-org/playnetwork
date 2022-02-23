import './players/player.js';
import './players/players.js';
import './users/user.js';
import './users/users.js';
import './rooms/room.js';
import './rooms/rooms.js';
import './levels.js';
import './interpolation.js';

/**
 * @callback callback
 * @param {string} error
 * @param {object} data
 */

/**
 * @callback connectCallback
 * @param {User} user
 */

/**
 * Play Network
 * @extends pc.EventHandler
 * @name PlayNetwork
 * @property {Users} users
 * @property {Rooms} rooms
 * @property {Levels} levels
 * @property {Players} players
 */
class PlayNetwork extends pc.EventHandler {
    constructor() {
        super();

        this._lastId = 1;
        this._callbacks = new Map();
    }

    initialize() {
        this.users = new Users();
        this.rooms = new Rooms();
        this.levels = new Levels();
        this.players = new Players();
    }

    /**
     * Create websocket connection
     * @param {connectCallback} callback
     */
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
            msg.id = this._lastId;
            this._callbacks.set(this._lastId, callback);
            this._lastId++;
        }

        this.socket.send(JSON.stringify(msg));
    }

    _onMessage(data) {
        const msg = JSON.parse(data);

        if (msg.id) {
            const callback = this._callbacks.get(msg.id);

            if (!callback) {
                console.warn(`No callback with id - ${msg.id}`);
                return;
            }

            callback(msg.data?.err, msg.data);
            this._callbacks.delete(msg.id);
        }

        if (msg.data?.err) {
            console.warn(msg.data.err);
            return;
        }

        if (msg.id) return;

        switch (msg.scope.type) {
            case 'user':
                this.users.me?.fire(msg.name, msg.data);
                break;
            case 'room':
                this.rooms.get(msg.scope.id)?.fire(msg.name, msg.data);
                break;
            case 'player':
                this.players.get(msg.scope.id)?.fire(msg.name, msg.data);
                break;
        }

        this.fire(msg.name, msg.data);
    }
}

window.pn = new PlayNetwork();
window.pn.initialize();
