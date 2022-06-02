import * as pc from 'playcanvas';
import node from './index.js';

import performance from './libs/node-performance.js';

/**
 * @class User
 * @classdesc User interface which is created for each individual connection
 * from {@link PlayNetwork} to a {@link Node}. User can join multiple rooms
 * @extends pc.EventHandler
 * @property {number} id Unique identifier per connection, same as {@link Client} ID.
 * @property {Set<Room>} rooms List of {@link Room}s that user has joined.
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
    constructor(id) {
        super();

        this.id = id;
        this.rooms = new Set();

        // performance.addBandwidth(this, 'user', this.id);
        node.send('_routes:add', { type: 'users', id: this.id });
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

        node.send('_message', { userId: this.id, name, data, scope, msgId });
    }

    toData() {
        return {
            id: this.id
        };
    }

    destroy() {
        this.fire('disconnect');

        for (const room of this.rooms) {
            room.leave(this);
        }

        this.fire('destroy');

        this.rooms = null;
        // performance.removeBandwidth(this);

        this.off();

        node.send('_routes:remove', { type: 'users', id: this.id });
    }
}
