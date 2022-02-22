import './players/player.js';
import './players/players.js';
import './users/user.js';
import './users/users.js';
import './rooms/room.js';
import './rooms/rooms.js';
import './levels.js';
import './templates.js';
import './interpolation.js';

/**
 * @callback callback
 * @param {string} error
 * @param {object} data
 */

/**
 * Play Network
 * @extends pc.EventHandler
 * @name PlayNetwork
 */
class PlayNetwork extends pc.EventHandler {
    constructor() {
        super();

        this._lastCallbackId = 1;
        this._callbacks = new Map();
    }

    initialize() {
        /**
        * User
        * @type {Users}
        */
        this.users = new Users();

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
         * @type {Players}
         */
        this.players = new Players();

        /**
         * Templates
         * @type {Templates}
         */
        this.templates = new Templates();
    }

    /**
     * Create websocket connection
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
            msg.callbackId = this._lastCallbackId;
            this._callbacks.set(this._lastCallbackId, callback);
            this._lastCallbackId++;
        }

        this.socket.send(JSON.stringify(msg));
    }

    _onMessage(data) {
        const msg = JSON.parse(data);

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
    }
}

window.pn = new PlayNetwork();
window.pn.initialize();
