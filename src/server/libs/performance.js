import * as pc from 'playcanvas';
import pn from './../../server/index.js';

class Performance extends pc.EventHandler {
    constructor() {
        super();

        this._pingIds = 1;

        this._cpuLoad = 0;
        this._lastCpuLoad = process.cpuUsage();
        this._lastCpuLoadCheck = Date.now();

        this._memory = 0;

        this._updateInterval = setInterval(() => {
            const load = process.cpuUsage();
            const loadDelta = (load.user - this._lastCpuLoad.user) + (load.system - this._lastCpuLoad.system);
            const time = Date.now();
            const timeDelta = (time - this._lastCpuLoadCheck) * 1000;

            this._cpuLoad = loadDelta / timeDelta;
            this._lastCpuLoad = load;
            this._lastCpuLoadCheck = time;

            this._memory = process.memoryUsage.rss();
        }, 1000);
    }

    connectSocket(socket, user) {
        socket.on('message', async e => {
            this._onMessage('in', user, e.rawData, e.msg);
        });

        const extensionsHeader = socket._driver._request.headers['sec-websocket-extensions'];
        const supportsDeflate = extensionsHeader && extensionsHeader.includes('permessage-deflate');
        const origSend = socket.send;

        if (!supportsDeflate) {
            socket.send = async (data) => {
                this._onMessage('out', user, data, JSON.parse(data));
                return origSend.call(socket, data);
            };

            return;
        }

        socket._deflateQueue = new Set();

        socket.onDeflate = async (data, compressedData) => {
            data = data.toString('utf8', 0, data.length);
            if (!socket._deflateQueue.has(data)) return;
            socket._deflateQueue.delete(data);
            this._onMessage('out', user, compressedData, JSON.parse(data));
        };

        socket.send = async (data) => {
            socket._deflateQueue.add(data);
            return origSend.call(socket, data);
        };

        this.on('deflateOut', socket.onDeflate, this);

        socket.on('close', () => {
            this.off('deflateOut', socket.onDeflate, this);
        });
    }

    addCpuLoad(scope) {
        Object.defineProperty(scope, 'cpuLoad', { get: () => this._cpuLoad, configurable: true });
    }

    addMemoryUsage(scope) {
        Object.defineProperty(scope, 'memory', { get: () => this._memory, configurable: true });
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

        scope._bandwidthFunction = (type, size, target) => {
            if (scope !== pn && scope !== target) return;
            bandwidth[type].current += size;
            updateBandwidth(type);
        };

        this.on('message', scope._bandwidthFunction, this);

        Object.defineProperty(scope, 'bandwidthIn', {
            get: () => {
                updateBandwidth('in');
                return bandwidth.in.saved;
            },
            configurable: true
        });

        Object.defineProperty(scope, 'bandwidthOut', {
            get: () => {
                updateBandwidth('out');
                return bandwidth.out.saved;
            },
            configurable: true
        });
    }

    addLatency(user) {
        user.latency = 0;

        user._pings = new Map();
        user._pingInterval = setInterval(() => {
            const id = this._pingIds++;
            user._pings.set(id, { scope: user, timestamp: Date.now() });
            user.send('_ping', { id, i: user.bandwidthOut, o: user.bandwidthIn, l: user.latency }, 'user');
        }, 1000);

        user.on('_pong', (from, id) => {
            if (from !== user) return;

            const ping = user._pings.get(id);
            if (!ping) return;

            user.latency = Date.now() - ping.timestamp;
            user._pings.delete(id);
        });
    }

    addRoomLatency(room) {
        room._lastPings = 0;
        room._pings = new Map();

        room.on('_pong', (user) => {
            const ping = room._pings.get(user.id);
            if (ping) ping.pong = true;
        });
    }

    handlePings(room) {
        const lastPings = room._lastPings;
        const now = Date.now();

        for (const ping of room._pings.values()) {
            if (!ping.pong || ping.latency) continue;
            ping.latency = now - ping.timestamp;
        }

        if (now - lastPings < 1000) return;

        for (const user of room.users.values()) {
            const lastPing = room._pings.get(user.id);
            if (lastPing && !lastPing.pong) continue;

            const ping = { timestamp: now, pong: false, latency: 0, roomId: room.id };
            room._pings.set(user.id, ping);

            user.send('_ping', { r: room.id, l: lastPing?.latency || 0 });
        }

        room._lastPings = now;
    }

    removeBandwidth(scope) {
        this.off('message', scope._bandwidthFunction, this);
        delete scope._bandwidthFunction;
        delete scope.bandwidthIn;
        delete scope.bandwidthOut;
    }

    removeLatency(user) {
        clearInterval(user._pingInterval);
        user.off('_pong');
        delete user._pingInterval;
        delete user._pings;
        delete user.latency;
    }

    removeRoomLatency(room) {
        room.off('_pong');
        delete room._pings;
        delete room._lastPings;
    }

    async _onMessage(type, user, data, msg) {
        const size = typeof data === 'string' ? Buffer.byteLength(data, 'utf-8') : data.byteLength;
        const target = this._getTarget(msg);

        this.fire('message', type, size);
        this.fire('message', type, size, user);
        if (target && target !== user) this.fire('message', type, size, target);
    }

    _getTarget(msg) {
        if (!msg.scope) return;

        switch (msg.scope.type) {
            case 'user': return pn.users.get(msg.scope.id);
            case 'room': return pn.rooms.get(msg.scope.id);
            case 'networkEntity': return pn.networkEntities.get(msg.scope.id);
        }
    }
}

export default new Performance();
