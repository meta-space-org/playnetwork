import './network-entities/network-entities.js';
import './players/player.js';
import './users/user.js';
import './users/users.js';
import './rooms/room.js';
import './rooms/rooms.js';
import './levels.js';
import './interpolation.js';
import './performance.js';

/**
 * @class PlayNetwork
 * @classdesc Main interface to connect to a server and interact with networked data.
 * @extends pc.EventHandler
 * @property {Users} users Interface to access all known {@link User}s to a client.
 * @property {Rooms} rooms Interface with a list of all {@link Room}s that
 * {@link User} has joined.
 * @property {Levels} levels
 * @property {Performance} performance Interface to access collected performance data.
 * @property {number} performance.latency Current network latency in miliseconds.
 * @property {number} performance.bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} performance.bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

/**
 * @callback responseCallback
 * @param {string} error Response `Error`.
 * @param {object|array|string|number|boolean|null} data Response data.
 */

/**
 * @callback connectCallback
 * @param {User} user Our {@link User} object.
 */

/**
 * @event PlayNetwork#connect
 * @description Fired when client has connected to a server and received
 * an own {@link User} data.
 * @param {User} user Own user instance.
 */

/**
 * @event PlayNetwork#disconnect
 * @description Fired after client has been disconnected from a server.
 */

/**
 * @event PlayNetwork#error
 * @description Fired when networking error occurs.
 * @param {Error} error
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
        this.players = new Map();
        this.networkEntities = new NetworkEntities();
        this.performance = new Performance(this);
    }

    /**
     * @method connect
     * @description Create a WebSocket connection to the server.
     * @param {string} host Host to connect to
     * @param {string} port Port to connect to
     * @param {connectCallback} callback Callback that will be fired when
     * connection is succesfull.
     */
    connect(host, port, callback) {
        this.socket = new WebSocket(`wss://${host}${port ? `:${port}` : ''}/websocket`);

        this.socket.onmessage = (e) => this._onMessage(e.data);

        this.socket.onopen = () => { };

        this.socket.onclose = () => {
            this.performance.destroy();
            this.performance = null;
            this.fire('disconnect');
        };

        this.socket.onerror = (err) => {
            this.fire('error', err);
        };

        this.once('_self', (data) => {
            const user = new User(data.id, true);
            if (callback) callback(user);
            this.fire('connect', user);
        });
    }

    /**
     * @method send
     * @desctiption Send named message to server with optional data
     * and a response callback.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean|null} [data] Data for a message,
     * should be a JSON friendly data.
     * @param {responseCallback} [callback] Response callback that will be called
     * when server sends response message. This is similar to RPC.
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

        if (msg.msgId) {
            const callback = this._callbacks.get(msg.msgId);

            if (!callback) {
                console.warn(`No callback with id - ${msg.msgId}`);
                return;
            }

            callback(msg.data?.err, msg.data);
            this._callbacks.delete(msg.msgId);
        }

        if (msg.data?.err) {
            console.warn(msg.data.err);
            return;
        }

        if (msg.msgId) return;

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
            case 'networkEntity':
                this.networkEntities.get(msg.scope.id)?.fire(msg.name, msg.data);
                break;
        }

        if (msg.name === '_ping') this._send('_pong', { id: msg.data.id }, msg.scope.type, msg.scope.id);
        if (msg.name === '_ping' && msg.scope !== 'user') return;
        this.fire(msg.name, msg.data);
    }
}

window.pn = new PlayNetwork();
window.pn.initialize();
