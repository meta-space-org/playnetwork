import * as pc from 'playcanvas';
import node from './index.js';

import performance from './libs/node-performance.js';

/**
 * @class User
 * @classdesc User interface which is created for each individual connection.
 * User can join multiple rooms, and will have unique {@link Player} per room.
 * @extends pc.EventHandler
 * @property {number} id Unique identifier per connection.
 * @property {Set<Room>} rooms List of {@link Room}s that user has joined.
 * @property {Set<Player>} players List of {@link Player}s belonging to a user,
 * one {@link Player} per {@link Room}.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

/**
 * @event User#disconnect
 * @description Fired when user gets disconnected,
 * before all related data is destroyed.
 */

/**
 * @event User#destroy
 * @description Fired after disconnect and related data is destroyed.
 */

export default class User extends pc.EventHandler {
    constructor(id) {
        super();

        this.id = id;
        this.rooms = new Set();
        this.players = new Set();
        this.playersByRoom = new Map();

        performance.addBandwidth(this, 'user', this.id);
        // TODO: latency
        node.channel.send('_routes:add', { type: 'users', id: this.id });
    }

    /**
     * @method send
     * @description Send a named message to a {@link User}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     * Must be JSON friendly data.
     */
    send(name, data) {
        this._send(name, data, 'user');
    }

    _send(name, data, scope, id, msgId) {
        scope = {
            type: scope,
            id: id
        };

        node.channel.send('_user:message', { clientId: this.id, name, data, scope, msgId });
    }

    toData() {
        return {
            id: this.id
        };
    }

    addPlayer(player) {
        if (this.players.has(player))
            return;

        const room = player.room;
        this.rooms.add(room);

        // indices
        this.players.add(player);
        this.playersByRoom.set(player.room, player);

        player.once('destroy', () => {
            this.rooms.delete(player.room);
            this.players.delete(player);
            this.playersByRoom.delete(player.room);
        });
    }

    /**
     * @method getPlayerByRoom
     * @description Get {@link Player} of a {@link User} by {@link Room}.
     * @param {Room} room {@link Room} of which this {@link User} is a member.
     * @returns {Player|null} Player related to a specific {@link Room}
     * and this {@link User}
     */
    getPlayerByRoom(room) {
        return this.playersByRoom.get(room) || null;
    }

    destroy() {
        this.fire('disconnect');

        for (const room of this.rooms) {
            room.leave(this);
        }

        this.fire('destroy');

        this.rooms = null;
        this.players = null;
        performance.removeBandwidth(this);

        this.off();

        node.channel.send('_routes:remove', { type: 'users', id: this.id });
    }
}
