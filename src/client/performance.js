/**
 * @class Performance
 * @classdesc Helper class to collect performance data.
 */

class Performance {
    constructor(scope) {
        this.latency = 0;
        this.bandwidthIn = 0;
        this.bandwidthOut = 0;

        scope.on('_ping', this._onPing, this);
    }

    destroy(scope) {
        scope.off('_ping', this._onPing, this);
    }

    _onPing(data) {
        this.latency = data.l;
        this.bandwidthIn = data.i || 0;
        this.bandwidthOut = data.o || 0;
    }

    _debugPrint() {
        console.log(`Latency: ${this.latency} ms`);
        console.log(`Bandwidth: ${this.bandwidthIn} B/s in, ${this.bandwidthOut} B/s out`);
    }
}
