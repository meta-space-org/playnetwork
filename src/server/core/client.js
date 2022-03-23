import pc from 'playcanvas';

import performance from '../libs/server-performance.js';

/**
 * @class Client
 * @classdesc Client interface which is created for each individual connection.
 * Client can connect multiple nodes
 * @extends pc.EventHandler
 * @property {number} id Unique identifier per connection.
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
        this.nodes = new Set();
        this.socket = socket;

        performance.addBandwidth(this);
        performance.addLatency(this);

        this.send('_self', this.toData(), 'user');
    }

    send(name, data, scope, msgId) {
        this.socket.send(JSON.stringify({ name, data, scope, id: msgId }));
    }

    isConnectedToNode(node) {
        return this.nodes.has(node);
    }

    async connectToNode(node) {
        this.nodes.add(node);

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
        if (!this.socket) return;
        this.socket.close();
    }

    async destroy() {
        if (!this.socket) return;

        this.fire('disconnect');

        for (const node of this.nodes) {
            await this._disconnectFromNode(node);
        }

        performance.removeBandwidth(this);
        performance.removeLatency(this);

        this.fire('destroy');

        this.socket = null;
        this.nodes = null;

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
