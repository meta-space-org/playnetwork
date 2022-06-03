import Performance from '../../server/libs/performance.js';

class NodePerformance extends Performance {
    constructor() {
        super(() => {
            return process.memoryUsage().heapUsed;
        });

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

    handlePings(room) {
        const lastPings = room._lastPings || 0;
        const now = Date.now();

        for (const [user, ping] of this.pings) {
            if (!ping.pong || ping.latencyCalculated) continue;
            ping.latencyCalculated = true;
            user.latency = now - ping.timestamp;
        }

        if (now - lastPings < 1000) return;

        for (const user of room.users.values()) {
            const lastPing = this.pings.get(user);
            if (lastPing && !lastPing.pong) continue;

            const ping = { timestamp: now, pong: false, latencyCalculated: false };
            this.pings.set(user, ping);

            user.send('_ping', { l: user.latency || 0 });
        }

        room._lastPings = now;
    }

    handlePong(user) {
        const ping = this.pings.get(user);
        if (ping) ping.pong = true;
    }

    removeUser(user) {
        this.pings.delete(user);
    }
}

export default new NodePerformance();
