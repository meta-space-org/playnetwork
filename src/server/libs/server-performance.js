import Performance from './performance.js';

import { encodeBuffer } from './utils.js';

class ServerPerformance extends Performance {
    constructor() {
        super(() => {
            return process.memoryUsage.rss();
        });
    }

    connectSocket(server, client, socket) {
        const extensionsHeader = socket._driver._request.headers['sec-websocket-extensions'];
        const supportsDeflate = extensionsHeader && extensionsHeader.includes('permessage-deflate');

        const onSend = (data, compressedData) => {
            const msg = JSON.parse(data);

            const size = typeof compressedData === 'string' ? Buffer.byteLength(compressedData, 'utf-8') : compressedData.byteLength;

            this.events.fire('message', size, 'out');

            const node = this._getNode(server, client, msg.scope.type, msg.scope.id);
            if (node) this._sendBandwidthToNode(node, msg.scope.type, msg.scope.id, size, 'out');
        };

        const origSend = socket.send;

        if (!supportsDeflate) {
            socket.send = async (data) => {
                if (data !== 'ping' && data !== 'pong') onSend(data, data);
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
                if (data !== 'ping' && data !== 'pong') socket._deflateQueue.add(data);
                return origSend.call(socket, data);
            };

            this.events.on('deflateOut', socket.onDeflate, this);

            socket.on('close', () => {
                this.events.off('deflateOut', socket.onDeflate, this);
            });
        }

        socket.on('message', async e => {
            if (e.data === 'ping') socket.send('pong');
            if (e.data === 'ping' || e.data === 'pong') return;

            const size = typeof e.rawData === 'string' ? Buffer.byteLength(e.rawData, 'utf-8') : e.rawData.byteLength;

            this.events.fire('message', size, 'in');

            const node = this._getNode(server, client, e.msg.scope.type, e.msg.scope.id);
            if (node) this._sendBandwidthToNode(node, e.msg.scope.type, e.msg.scope.id, size, 'in');
        });
    }

    addBandwidth(scope) {
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

        scope._bandwidthFunction = (size, type) => {
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
