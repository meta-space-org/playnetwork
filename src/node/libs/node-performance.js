import Performance from '../../server/libs/performance.js';

class NodePerformance extends Performance {
    constructor() {
        super(() => {
            return process.memoryUsage().heapUsed;
        });
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
}

export default new NodePerformance();
