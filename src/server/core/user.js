import pc from 'playcanvas';

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
        this.workerNodes = new Set();
        this._socket = socket;

        performance.addBandwidth(this);
        performance.addLatency(this);

        this.send('_self', this.toData(), 'user');
    }

    send(name, data, scope, msgId) {
        this._socket.send(JSON.stringify({ name, data, scope, id: msgId }));
    }

    isConnectedToWorkerNode(workerNode) {
        return this.workerNodes.has(workerNode);
    }

    async connectToWorkerNode(workerNode) {
        this.workerNodes.add(workerNode);
        workerNode.users.set(this.id, this);

        return new Promise((resolve) => {
            workerNode.send('_open', this.id, this.id, () => {
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

        for (const workerNode of this.workerNodes) {
            await this._disconnectFromWorkerNode(workerNode);
        }

        performance.removeBandwidth(this);
        performance.removeLatency(this);

        this.fire('destroy');

        this._socket = null;
        this.workerNodes = null;

        this.off();
    }

    _disconnectFromWorkerNode(workerNode) {
        workerNode.users.delete(this.id);

        return new Promise((resolve) => {
            workerNode.send('_close', this.id, this.id, () => {
                resolve();
            });
        });
    }
}
