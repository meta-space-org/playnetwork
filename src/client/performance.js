/**
 * @class Performance
 * @classdesc Helper class to collect performance data.
 * @property {number} latency Current latency in miliseconds.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

class Performance {
    constructor(scope) {
        this.latency = 0;
        this.bandwidthIn = 0;
        this.bandwidthOut = 0;

        scope._onPing = (data) => {
            this.latency = data.l;
            this.bandwidthIn = data.i;
            this.bandwidthOut = data.o;
        }

        scope.on('_ping', scope._onPing, this);
    }

    destroy(scope) {
        scope.off('_ping', scope._onPing, this);
    }

    _debugPrint() {
        console.log(`Latency: ${this.latency} ms`);
        console.log(`Bandwidth: ${this.bandwidthIn} B/s in, ${this.bandwidthOut} B/s out`);
    }
}
