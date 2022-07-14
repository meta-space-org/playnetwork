import * as pc from 'playcanvas';
import pn from './../index.js';

import performance from '../libs/performance.js';

/**
 * @class User
 * @classdesc User interface which is created for each individual connection and inter-connections to a {@link PlayNetwork}.
 * @extends pc.EventHandler
 * @property {number|string} id Unique identifier for the user.
 * @property {null|Room} room {@link Room} that {@link User} is currently joined to.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {number} latency Latency of the connection in milliseconds.
 */

/**
 * @event User#join
 * @description Fired when {@link User} is joined to a {@link Room}.
 * @param {Room} room {@link Room} that {@link User} is joined.
 */

/**
 * @event User#leave
 * @description Fired when {@link User} left {@link Room}.
 * @param {Room} room {@link Room} that {@link User} left.
 */

/**
 * @event User#destroy
 * @description Fired after disconnect and related data is destroyed.
 */

/**
 * @event User#*
 * @description {@link User} will receive own named network messages.
 * @param {User} sender {@link User} that sent the message.
 * @param {object|array|string|number|boolean} [data] Message data.
 * @param {responseCallback} callback Callback that can be called to respond to a message.
 */

export default class User extends pc.EventHandler {
    constructor(id, socket, serverId) {
        super();

        this.id = id;
        this.serverId = serverId;
        this.room = null;

        if (serverId) return;

        this.socket = socket;
        performance.addBandwidth(this);
        performance.addLatency(this);

        this.on('_send', (_, msg) => {
            this._send(msg.name, msg.data, msg.scope?.type, msg.scope?.id, msg.id);
        }, this);
    }

    /**
     * @method join
     * @description Join to a {@link Room}.
     * @async
     * @param {number} roomId ID of the {@link Room} to join.
     * @returns {null|Error} returns {@link Error} if failed to join.
     */
    async join(roomId) {
        const room = pn.rooms.get(roomId);
        if (!room) {
            const serverId = parseInt(await pn.redis.HGET('_route:room', roomId.toString()));
            if (!serverId) return new Error('Room not found');
            this.room = roomId;
            pn.servers.get(serverId, (server) => {
                server.send('_room:join', roomId, null, null, this.id);
            });
            return null;
        };

        if (this.room) {
            if (this.room.id === roomId) return new Error('Already in this room');
            await this.leave();
        }

        const usersData = {};
        for (const [id, user] of room.users) {
            usersData[id] = user.toData();
        }

        this.room = room;

        this.send('_room:join', {
            tickrate: room.tickrate,
            users: usersData,
            level: room.toData(),
            state: room.networkEntities.getState(true),
            id: room.id
        });
        this.room.users.set(this.id, this);
        this.room.send('_user:join', this.toData());

        this.room.fire('join', this);
        this.fire('join', this.room);

        pn.rooms.fire('join', this.room, this);

        return null;
    }

    /**
     * @method leave
     * @description Leave a {@link Room} to which is currently joined.
     * @async
     * @returns {null|Error} returns {@link Error} if failed to leave.
     */
    async leave() {
        if (!this.room) return new Error('Not in a room');
        if (isFinite(this.room)) {
            const serverId = parseInt(await pn.redis.HGET('_route:room', this.room.toString()));
            if (!serverId) return new Error('Room not found');
            pn.servers.get(serverId, (server) => {
                server.send('_room:leave', null, null, null, this.id);
            });
            return null;
        }

        this.send('_room:leave');
        this.room.users.delete(this.id);
        this.room.send('_user:leave', this.id);

        this.room.fire('leave', this);
        this.fire('leave', this.room);

        pn.rooms.fire('leave', this.room, this);

        this.room = null;

        return null;
    }

    /**
     * @method send
     * @description Send a named message to a {@link User}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] JSON friendly message data.
     */
    send(name, data) {
        this._send(name, data, 'user', this.id);
    }

    _send(name, data, scope, id, msgId) {
        const msg = { name, data, scope: { type: scope, id: id }, id: msgId };

        if (!this.serverId) return this.socket.send(JSON.stringify(msg));
        pn.servers.get(this.serverId, (server) => server.send('_send', msg, 'user', this.id, this.id));
    }

    toData() {
        return {
            id: this.id
        };
    }

    destroy() {
        this.leave();
        this.room = null;

        if (!this.serverId) {
            performance.removeBandwidth(this);
            performance.removeLatency(this);
            pn.redis.HDEL('_route:user', this.id.toString());
            pn.redis.PUBLISH('_destroy:user', this.id.toString());
        }

        this.fire('destroy');
        this.off();
    }
}
