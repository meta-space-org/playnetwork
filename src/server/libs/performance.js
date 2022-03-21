import * as pc from 'playcanvas';

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
        const socketRequest = socket._driver._request;
        const extensionsHeader = socketRequest.headers['sec-websocket-extensions'];
        const supportsDeflate = extensionsHeader && extensionsHeader.includes('permessage-deflate');

        console.log('Socket supports deflate: ', supportsDeflate);

        const wsSend = socket.send;
        socket.send = async (data) => {
            if (data !== 'ping' && data !== 'pong') {
                // TODO: extension with sendMessage event
                const msg = JSON.parse(data);
                this.events.fire('message', { data, msg }, 'out');
            }

            return wsSend.call(socket, data);
        };

        socket.on('message', async e => {
            if (e.data === 'ping') socket.send('pong');
            if (e.data === 'ping' || e.data === 'pong') return;

            this.events.fire('message', e, 'in');
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

            let size = 0;

            if (e.rawData) {
                size = typeof e.rawData === 'string' ? e.rawData.length : e.rawData.byteLength;
            } else {
                size = Buffer.byteLength(e.data, 'utf-8');
            }

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
