import './network-entities/network-entities.js';
import './users/user.js';
import './rooms/room.js';
import './levels.js';
import './interpolation.js';

/**
 * @class PlayNetwork
 * @classdesc Main interface to connect to a server and interact with networked data.
 * @extends pc.EventHandler
 * @property {Users} users Interface to access all known {@link User}s to a client.
 * @property {Room} {@link Room} that {@link User} has joined.
 * @property {Levels} levels
 * @property {number} latency Current network latency in miliseconds.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {User} me Local user
 */

/**
 * @callback responseCallback
 * @param {string|null} error Response `Error`.
 * @param {object|array|string|number|boolean|null} [data] Response data.
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
        this.room = null;
        this.levels = new Levels();
        this.latency = 0;
        this.bandwidthIn = 0;
        this.bandwidthOut = 0;
        this.me = null;

        this.on('_room:join', async ({ tickrate, users, level, state, id }) => {
            this.room = new Room(id, tickrate, users);
            await this.levels.build(this.room, level);
            this.room.fire('_state:update', state);
        });

        this.on('_room:leave', () => {
            const room = this.room;
            this.room = null;
            room.destroy();
        });
    }

    /**
     * @method connect
     * @description Create a WebSocket connection to the PlayNetwork server.
     * @param {string} host Host of a server.
     * @param {number} port Port of a server.
     * @param {connectCallback} callback Callback that will be fired when
     * connection is succesfull.
     */
    connect(host, port, useSSL, payload, callback) {
        this.socket = new WebSocket(`${useSSL ? 'wss' : 'ws'}://${host}${port ? `:${port}` : ''}/websocket`);

        this.socket.onmessage = (e) => this._onMessage(e.data);

        this.socket.onopen = () => {
            this._send('_authenticate', payload, null, null, (err, userId) => {
                const user = new User(userId, true);
                this.me = user;

                if (callback) callback(err, user);
                if (!err) this.fire('connect', user);
            });
        };

        this.socket.onclose = () => {
            this.latency = 0;
            this.bandwidthIn = 0;
            this.bandwidthOut = 0;
            this.fire('disconnect');
        };

        this.socket.onerror = (err) => {
            this.fire('error', err);
        };
    }

    /**
     * @method createRoom
     * @description Send a request to a server, to create a {@link Room}.
     * @param {object|array|string|number|boolean} data Request data that can be
     * user by Server to decide room creation.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    createRoom(data, callback) {
        this.send('_room:create', data, (err, data) => {
            if (callback) callback(err, data);
        });
    }

    /**
     * @method joinRoom
     * @description Send a request to a server, to join a {@link Room}.
     * @param {number} id ID of a {@link Room} to join.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    joinRoom(id, callback) {
        if (this.room?.id === id) {
            if (callback) callback(`Already joined a Room ${id}`);
            return;
        }

        this.send('_room:join', id, (err, data) => {
            if (callback) callback(err, data);
        });
    }

    /**
     * @method leaveRoom
     * @description Send a request to a server, to leave a {@link Room}.
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    leaveRoom(callback) {
        if (!this.room) {
            if (callback) callback(`Not in a Room`);
            return;
        }

        this.send('_room:leave', null, (err, data) => {
            if (callback) callback(err, data);
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
     * if server sends response message. This is similar to RPC.
     */
    send(name, data, callback) {
        this._send(name, data, 'server', null, callback);
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

            callback(msg.data?.err || null, msg.data);
            this._callbacks.delete(msg.id);
        }

        if (msg.data?.err) {
            console.warn(msg.data.err);
            return;
        }

        if (msg.id) return;

        switch (msg.scope?.type) {
            case 'user':
                this.me?.fire(msg.name, msg.data);
                break;
            case 'room':
                this.room.fire(msg.name, msg.data);
                break;
            case 'networkEntity':
                this.room.networkEntities.get(msg.scope.id)?.fire(msg.name, msg.data);
                break;
        }

        if (msg.name === '_ping' && this.me) this._onPing(msg.data);
        this.fire(msg.name, msg.data);
    }

    _onPing(data) {
        this.send('_pong', { id: data.id, r: data.r });

        if (data.r) {
            this.room.latency = data.l
        } else {
            this.latency = data.l;
            this.bandwidthIn = data.i || 0;
            this.bandwidthOut = data.o || 0;
        }
    }
}

window.pn = new PlayNetwork();
window.pn.initialize();

pc.ScriptComponent.prototype._scriptMethod = function(script, method, arg) {
    try {
        script[method](arg);
    } catch (ex) {
        script.enabled = false;
        console.warn(`unhandled exception while calling "${method}" for "${script.__scriptType.__name}" script: `, ex);
        console.error(ex);
    }
}
