import pc from 'playcanvas';
import pn from './../index.js';

import performance from '../libs/server-performance.js';

/**
 * @class User
 * @classdesc User interface which is created for each individual connection.
 * It can be connected to multiple {@link WorkerNode}s, and represents a single
 * {@link User}.
 * @extends pc.EventHandler
 * @property {number} id Unique identifier per connection.
 * @property {number} latency Network latency in miliseconds.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

/**
 * @event User#disconnect
 * @description Fired when client gets disconnected, before all related data is
 * destroyed.
 */

/**
 * @event User#destroy
 * @description Fired after disconnect and related data is destroyed.
 */

export default class User extends pc.EventHandler {
    static ids = 1;

    constructor(socket) {
        super();

        this.id = User.ids++;
        this._socket = socket;

        // performance.addBandwidth(this);
        // performance.addLatency(this);

        this.send('_self', this.toData(), 'user');
    }

    send(name, data, scope, msgId) {
        this._socket.send(JSON.stringify({ name, data, scope, id: msgId }));
    }

    async connectToNode(node) {
        return new Promise((resolve) => {
            node.send('_open', this.id, this.id, () => {
                resolve();
            });
        });
    }

    toData() {
        return {
            id: this.id
        };
    }

    /**
     * @method disconnect
     * @description Force disconnect a {@link Client}.
     */
    disconnect() {
        if (!this._socket) return;
        this._socket.close();
    }

    async destroy() {
        if (!this._socket) return;

        this.fire('disconnect');

        for (const node of pn.nodes.values()) {
            await this._disconnectFromNode(node);
        }

        // performance.removeBandwidth(this);
        // performance.removeLatency(this);

        this.fire('destroy');

        this._socket = null;

        this.off();
    }

    _disconnectFromNode(node) {
        return new Promise((resolve) => {
            node.send('_close', this.id, this.id, () => {
                resolve();
            });
        });
    }
}
