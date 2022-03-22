import Performance from '../../server/libs/performance.js';

class NodePerformance extends Performance {
    constructor() {
        super(() => {
            return process.memoryUsage().heapUsed;
        });

        this.latency = 0;
        this.pingIds = 0;
        this.pings = new Map();
    }

    connectChannel(channel) {
        this.channel = channel;
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

        scope._bandwidthFunction = (data) => {
            if (target && target !== data.scope) return;
            if (targetId && targetId !== data.scopeId) return;

            bandwidth[data.type].current += data.size;
            updateBandwidth(data.type);
        };

        this.channel.on('_performance:bandwidth', scope._bandwidthFunction, this);

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
        this.channel.off('_performance:bandwidth', scope._bandwidthFunction, this);
    }

    addLatency(scope) {
        scope.latency = 0;
    }

    removeLatency(scope) {
        this.pings = new Map([...this.pings].filter((e) => e[1].scope !== scope));
    }

    startPingInterval(scope) {
        scope._pingInterval = setInterval(() => {
            this.sendPing(scope);
        }, 1000);

        scope.on('_pong', (id) => {
            this.recievePong(scope, id);
        });
    }

    stopPingInterval(scope) {
        clearInterval(scope._pingInterval);
    }

    sendPing(scope) {
        const id = this.pingIds++;
        this.pings.set(id, { scope, timestamp: Date.now() });
        scope.send('_ping', { id, i: scope.bandwidthIn, o: scope.bandwidthOut, l: scope.latency });
    }

    recievePong(scope, id) {
        const ping = this.pings.get(id);

        if (!ping) return;

        scope.latency = Date.now() - ping.timestamp;
        this.pings.delete(id);
    }
}

export default new NodePerformance();
