import * as pc from 'playcanvas';
import pn from './../index.js';

/**
 * @class User
 * @classdesc User interface which is created for each individual connection to a {@link PlayNetwork}
 * @extends pc.EventHandler
 * @property {number} id Unique identifier per connection, same as {@link Client} ID.
 * @property {Room} room {@link Room} that user has joined.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

/**
 * @event User#disconnect
 * @description Fired when user gets disconnected, before all related data is
 * destroyed.
 */

/**
 * @event User#destroy
 * @description Fired after disconnect and related data is destroyed.
 */

export default class User extends pc.EventHandler {
    constructor(id, socket, serverId) {
        super();

        this.id = id;
        this.serverId = serverId;

        this.room = null;
        this.socket = socket;

        //performance.addBandwidth(this, 'user', this.id);
    }

    async join(roomId) {
        const room = pn.rooms.get(roomId);
        if (!room) {
            const serverId = parseInt(await pn.redis.HGET('route:room', roomId.toString()));
            if (!serverId) return new Error('Room not found');
            this.room = roomId;
            pn.server.send('_message', { name: '_room:join', data: roomId }, serverId, this.id);
            return;
        };

        if (this.room) {
            if (this.room.id === roomId) return new Error('Already in this room');
            this.leave();
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
        this.fire('join', this);

        pn.rooms.fire('join', this.room, this);
    }

    async leave() {
        if (!this.room) return new Error('Not in a room');
        if (isFinite(this.room)) {
            const serverId = parseInt(await pn.redis.HGET('route:room', this.room.toString()));
            if (!serverId) return new Error('Room not found');
            pn.server.send('_message', { name: '_room:leave' }, serverId, this.id);
            return;
        }

        this.send('_room:leave');
        this.room.users.delete(this.id);
        this.room.send('_user:leave', this.id);

        this.room.fire('leave', this);
        this.fire('leave');

        pn.rooms.fire('leave', this.room, this);

        //performance.removeUser(this.room.id, this.id);
        this.room = null;
    }

    /**
     * @method send
     * @description Send a named message to a {@link User}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     * Must be JSON friendly data.
     */
    send(name, data) {
        this._send(name, data, 'user', this.id);
    }

    _send(name, data, scope, id, msgId) {
        scope = {
            type: scope,
            id: id
        };

        const msg = { name, data, scope, id: msgId };

        if (this.serverId) {
            pn.server.send('_send', msg, this.serverId, this.id);
            return;
        }

        this.socket.send(JSON.stringify(msg));
    }

    toData() {
        return {
            id: this.id
        };
    }

    destroy() {
        this.leave();
        this.room = null;
        //performance.removeBandwidth(this);
        pn.redis.HDEL('route:user', this.id.toString());
        this.fire('destroy');
        this.off();
    }
}
