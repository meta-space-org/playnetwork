import * as pc from 'playcanvas';
import { encodeBuffer } from './utils.js';

class Performance {
    constructor() {
        this.events = new pc.EventHandler();

        this.cpuLoad = 0;
        this.memory = 0;

        this.lastCpuLoad = process.cpuUsage();
        this.lastCpuLoadCheck = Date.now();

        this.updateInterval = setInterval(() => {
            const load = process.cpuUsage();
            const loadDelta = (load.user - this.lastCpuLoad.user) + (load.system - this.lastCpuLoad.system);
            const time = Date.now();
            const timeDelta = (time - this.lastCpuLoadCheck) * 1000;

            this.cpuLoad = loadDelta / timeDelta;
            this.memory = process.memoryUsage.rss();

            this.lastCpuLoad = load;
            this.lastCpuLoadCheck = time;
        }, 2000);
    }

    connectSocket(socket) {
        const extensionsHeader = socket._driver._request.headers['sec-websocket-extensions'];
        const supportsDeflate = extensionsHeader && extensionsHeader.includes('permessage-deflate');

        const onSend = (data, compressedData) => {
            const msg = JSON.parse(data);
            this.events.fire('message', { data: compressedData, msg }, 'out');
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

            this.events.fire('message', { data: e.rawData, msg: e.msg }, 'in');
        });
    }

    addCpuLoad(scope) {
        Object.defineProperty(scope, 'cpuLoad', {
            get: () => this.cpuLoad
        });
    }

    addMemoryUsage(scope) {
        Object.defineProperty(scope, 'memory', {
            get: () => this.memory
        });
    }

    addBandwidth(scope, target, targetId) {
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

        scope._bandwidthFunction = (e, type) => {
            if (target && target !== e.msg.scope.type) return;
            if (targetId && targetId !== e.msg.scope.id) return;

            const size = typeof e.data === 'string' ? Buffer.byteLength(e.data, 'utf-8') : e.data.byteLength;

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
}

export default new Performance();
