import pc from 'playcanvas';

import performance from '../libs/server-performance.js';

/**
 * @class Client
 * @classdesc Client interface which is created for each individual connection.
 * Client can connect multiple nodes
 * @extends pc.EventHandler
 * @property {number} id Unique identifier per connection.
 * @property {number} latency Network latency in miliseconds.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */
/**
 * @event Client#disconnect
 * @description Fired when client gets disconnected,
 * before all related data is destroyed.
 */
/**
 * @event Client#destroy
 * @description Fired after disconnect and related data is destroyed.
 */
export default class Client extends pc.EventHandler {
    static ids = 1;

    constructor(socket) {
        super();

        this.id = Client.ids++;
        this._nodes = new Set();
        this._socket = socket;

        performance.addBandwidth(this);
        performance.addLatency(this);

        this.send('_self', this.toData(), 'user');
    }

    /**
     * @method send
     * @description TODO???
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     */
    send(name, data, scope, msgId) {
        this._socket.send(JSON.stringify({ name, data, scope, id: msgId }));
    }

    /**
     * @method isConnectedToNode
     * @description TODO???
     * @param {Node} node Node
     */
    isConnectedToNode(node) {
        return this._nodes.has(node);
    }

    /**
     * @method connectToNode
     * @async
     * @description TODO???
     * @param {Node} node Node
     */
    async connectToNode(node) {
        this._nodes.add(node);

        return new Promise((resolve) => {
            node.channel.send('_open', this.id, () => {
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

        for (const node of this._nodes) {
            await this._disconnectFromNode(node);
        }

        performance.removeBandwidth(this);
        performance.removeLatency(this);

        this.fire('destroy');

        this._socket = null;
        this._nodes = null;

        this.off();
    }

    _disconnectFromNode(node) {
        return new Promise((resolve) => {
            node.channel.send('_close', this.id, () => {
                resolve();
            });
        });
    }
}
