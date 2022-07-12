import './network-entities/network-entities.js';
import './user.js';
import './room.js';
import './levels.js';
import './interpolation.js';

/**
 * @class PlayNetwork
 * @classdesc Main interface to connect to a server and interact with networked data.
 * @extends pc.EventHandler
 * @property {User} me Local {@link User} object.
 * @property {Room} room {@link Room} that {@link User} has joined.
 * @property {number} latency Current network latency in miliseconds.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {Levels} levels Interface that allows to save hierarchy data to a server.
 */

/**
 * @callback messageCallback
 * @param {string|null} error Response `Error`.
 * @param {object|array|string|number|boolean|null} [data] Response data or object with error data.
 */

/**
 * @callback errorCallback
 * @param {string|null} error Response `Error`.
 */

/**
 * @callback connectCallback
 * @param {string|null} error Response `Error`.
 * @param {User|object} user Own {@link User} object or error data.
 */

/**
 * @callback createRoomCallback
 * @param {string|null} error Response `Error`.
 * @param {number|object} data ID of a created {@link Room} or object with error data.
 */

/**
 * @event PlayNetwork#connect
 * @description Fired when client has connected to a server and received
 * an own {@link User} data.
 * @param {User} user Own {@link User} instance.
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
        this.me = null;
        this.room = null;

        this.latency = 0;
        this.bandwidthIn = 0;
        this.bandwidthOut = 0;

        this.levels = new Levels();

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
     * @param {boolean} useSSL Use secure connection.
     * @param {object|array|string|number|boolean|null} [payload] Client authentication data.
     * @param {connectCallback} callback Will be fired when connection is succesfull or on error.
     */
    connect(host, port, useSSL, payload, callback) {
        this.socket = new WebSocket(`${useSSL ? 'wss' : 'ws'}://${host}${port ? `:${port}` : ''}/websocket`);

        this.socket.onmessage = (e) => this._onMessage(e.data);

        this.socket.onopen = () => {
            this._send('_authenticate', payload, null, null, (err, data) => {
                if (err) {
                    if (callback) callback(err, data);
                    else this.fire('error', err);

                    return;
                }

                const user = new User(data, true);
                this.me = user;

                if (callback) callback(err, user);
                this.fire('connect', user);
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
     * @param {object} data Request data that can be used by Server to decide room creation.
     * @param {createRoomCallback} callback Will be fired when room is created or on error.
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
     * @param {errorCallback} callback Will be fired when {@link Room} is joined or on error.
     */
    joinRoom(id, callback) {
        if (this.room?.id === id) {
            if (callback) callback(`Already joined a Room ${id}`);
            return;
        }

        this.send('_room:join', id, (err) => {
            if (callback) callback(err);
        });
    }

    /**
     * @method leaveRoom
     * @description Send a request to a server, to leave current {@link Room}.
     * @param {errorCallback} callback Will be fired when {@link Room} is left or on error.
     */
    leaveRoom(callback) {
        if (!this.room) {
            if (callback) callback(`Not in a Room`);
            return;
        }

        this.send('_room:leave', null, (err) => {
            if (callback) callback(err);
        });
    }

    /**
     * @method send
     * @desctiption Send named message to server with optional data and a response callback.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean|null} [data] Data for a message, should be a JSON friendly data.
     * @param {messageCallback} callback Callback that will be fired when response is received or on error.
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
        if (data.r && data.r === this.room.id) {
            this.room.latency = data.l;
            this.room.send('_pong');
        } else {
            this.latency = data.l;
            this.bandwidthIn = data.i || 0;
            this.bandwidthOut = data.o || 0;
            this.me.send('_pong', data.id);
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
