import Performance from './performance.js';

import User from '../core/user.js';

class ServerPerformance extends Performance {
    constructor() {
        super(() => {
            return process.memoryUsage.rss();
        });

        this.pingIds = 1;
        this.pings = new Map();
    }

    connectSocket(server, user, socket) {
        this._server = server;

        const extensionsHeader = socket._driver._request.headers['sec-websocket-extensions'];
        const supportsDeflate = extensionsHeader && extensionsHeader.includes('permessage-deflate');

        const onSend = (data, compressedData) => {
            const msg = JSON.parse(data);

            const size = typeof compressedData === 'string' ? Buffer.byteLength(compressedData, 'utf-8') : compressedData.byteLength;

            this.events.fire('message', size, 'out', user.id);

            const nodes = this._getNodes(user, msg);
            if (nodes) this._sendBandwidthToNodes(nodes, msg.scope.type, msg.scope.id, size, 'out');
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
                data = data.toString('utf8', 0, data.length);
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

            this.events.fire('message', size, 'in', user.id);

            const nodes = this._getNodes(user, e.msg);
            if (nodes) this._sendBandwidthToNodes(nodes, e.msg.scope.type, e.msg.scope.id, size, 'in');
        });
    }

    addBandwidth(scope) {
        const isUser = scope instanceof User;

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

        scope._bandwidthFunction = (size, type, userId) => {
            if (isUser && scope.id !== userId) return;

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

    addLatency(user) {
        user.latency = 0;

        user._pingInterval = setInterval(() => {
            const id = this.pingIds++;
            this.pings.set(id, { scope: user, timestamp: Date.now() });
            user.send('_ping', { id, i: user.bandwidthOut, o: user.bandwidthIn, l: user.latency }, 'user');
        }, 1000);

        user.on('_pong', ({ id, r }) => {
            if (r) {
                const node = this._server.routes.rooms.get(r);
                node?.send('_pong', { userId: user.id, roomId: r });
                return;
            }

            const ping = this.pings.get(id);

            if (!ping) return;

            user.latency = Date.now() - ping.timestamp;
            this.pings.delete(id);
        });
    }

    removeLatency(user) {
        clearInterval(user._pingInterval);
        user._pingInterval = null;
        this.pings = new Map([...this.pings].filter((e) => e[1].scope !== user));
    }

    _getNodes(user, msg) {
        if (!msg.scope) return;
        let nodes = [];

        switch (msg.scope.type) {
            case 'user': {
                if (!user.hasEvent(msg.name)) {
                    for (const node of this._server.nodes.values()) {
                        nodes.push(node);
                    }
                }
                break;
            }
            case 'room':
                nodes = [this._server.routes.rooms.get(msg.scope.id)];
                break;
            case 'networkEntity':
                nodes = [this._server.routes.networkEntities.get(msg.scope.id)];
                break;
        }

        if (!nodes.length) return;
        return nodes;
    }

    _sendBandwidthToNodes(nodes, scope, scopeId, size, type) {
        for (const node of nodes) {
            node?.send('_performance:bandwidth', { scope, scopeId, size, type });
        }
    }
}

export default new ServerPerformance();
