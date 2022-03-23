import Performance from './performance.js';

import Client from '../core/client.js';

import { encodeBuffer } from './utils.js';

class ServerPerformance extends Performance {
    constructor() {
        super(() => {
            return process.memoryUsage.rss();
        });

        this.pingIds = 0;
        this.pings = new Map();
    }

    connectSocket(server, client, socket) {
        const extensionsHeader = socket._driver._request.headers['sec-websocket-extensions'];
        const supportsDeflate = extensionsHeader && extensionsHeader.includes('permessage-deflate');

        const onSend = (data, compressedData) => {
            const msg = JSON.parse(data);

            const size = typeof compressedData === 'string' ? Buffer.byteLength(compressedData, 'utf-8') : compressedData.byteLength;

            this.events.fire('message', size, 'out', client.id);

            const node = this._getNode(server, client, msg.scope.type, msg.scope.id);
            if (node) this._sendBandwidthToNode(node, msg.scope.type, msg.scope.id, size, 'out');
        };

        const origSend = socket.send;

        if (!supportsDeflate) {
            socket.send = async (data) => {
                onSend(data, data);
                return origSend.call(socket, data);
            };
        } else {
            socket._deflateQueue = new Set();

            socket.onDeflate = function(data, compressedData) {
                data = encodeBuffer(data);
                if (!socket._deflateQueue.has(data)) return;
                socket._deflateQueue.delete(data);
                onSend(data, compressedData);
            };

            socket.send = async (data) => {
                socket._deflateQueue.add(data);
                return origSend.call(socket, data);
            };

            this.events.on('deflateOut', socket.onDeflate, this);

            socket.on('close', () => {
                this.events.off('deflateOut', socket.onDeflate, this);
            });
        }

        socket.on('message', async e => {
            const size = typeof e.rawData === 'string' ? Buffer.byteLength(e.rawData, 'utf-8') : e.rawData.byteLength;

            this.events.fire('message', size, 'in', client.id);

            if (e.msg.name === '_pong')
                client.fire('_pong', e.msg.data.id);

            const node = this._getNode(server, client, e.msg.scope.type, e.msg.scope.id);
            if (node) this._sendBandwidthToNode(node, e.msg.scope.type, e.msg.scope.id, size, 'in');
        });
    }

    addBandwidth(scope) {
        const isClient = scope instanceof Client;

        const bandwidth = {
            in: { lastCheck: Date.now(), current: 0, saved: 0 },
            out: { lastCheck: Date.now(), current: 0, saved: 0 }
        };

        function updateBandwidth(type) {
            const now = Date.now();

            if (now - bandwidth[type].lastCheck > 1000) {
                bandwidth[type].saved = bandwidth[type].current;
                bandwidth[type].current = 0;
                bandwidth[type].lastCheck = now;
            }
        }

        scope._bandwidthFunction = (size, type, clientId) => {
            if (isClient && scope.id !== clientId) return;

            bandwidth[type].current += size;
            updateBandwidth(type);
        };

        this.events.on('message', scope._bandwidthFunction, this);

        Object.defineProperty(scope, 'bandwidthIn', {
            get: () => {
                updateBandwidth('in');
                return bandwidth.in.saved;
            }
        });

        Object.defineProperty(scope, 'bandwidthOut', {
            get: () => {
                updateBandwidth('out');
                return bandwidth.out.saved;
            }
        });
    }

    removeBandwidth(scope) {
        this.events.off('message', scope._bandwidthFunction, this);
    }

    addLatency(scope) {
        scope.latency = 0;

        scope._pingInterval = setInterval(() => {
            const id = this.pingIds++;
            this.pings.set(id, { scope, timestamp: Date.now() });
            scope.send('_ping', { id, i: scope.bandwidthOut, o: scope.bandwidthIn, l: scope.latency }, 'user');
        }, 3000);

        scope.on('_pong', (id) => {
            const ping = this.pings.get(id);

            if (!ping) return;

            scope.latency = Date.now() - ping.timestamp;
            this.pings.delete(id);
        });
    }

    removeLatency(scope) {
        clearInterval(scope._pingInterval);
        scope._pingInterval = null;
        this.pings = new Map([...this.pings].filter((e) => e[1].scope !== scope));
    }

    _getNode(server, client, scope, scopeId) {
        switch (scope) {
            case 'user': return [...client.nodes][0] || server.nodes.get((client.id - 1) % server.nodes.size);
            case 'room': return server.routes.rooms.get(scopeId);
            case 'player': return server.routes.players.get(scopeId);
            case 'networkEntity': return server.routes.networkEntities.get(scopeId);
        }
    }

    _sendBandwidthToNode(node, scope, scopeId, size, type) {
        node.channel.send('_performance:bandwidth', { scope, scopeId, size, type });
    }
}

export default new ServerPerformance();
