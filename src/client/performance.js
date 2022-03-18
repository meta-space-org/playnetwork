/**
 * @class Performance
 * @classdesc Helper class to collect performance data.
 * @property {number} latency Current latency in miliseconds.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

class Performance {
    constructor() {
        this.latency = 0;

        this._bandwidth = {
            in: { lastCheck: Date.now(), current: 0, saved: 0 },
            out: { lastCheck: Date.now(), current: 0, saved: 0 }
        }
    }

    get bandwidthIn() {
        this._updateBandwidth('in');
        return this._bandwidth.in.saved;
    }

    get bandwidthOut() {
        this._updateBandwidth('out');
        return this._bandwidth.out.saved;
    }

    connectSocket(socket) {
        this._startPingPong(socket);

        const wsSend = socket.send;
        socket.send = async (data) => {
            this._onMessage(data, 'out');
            return wsSend.call(socket, data);
        };

        const wsReceive = socket.onmessage;
        socket.onmessage = async (e) => {
            if (e.data === 'pong')
                this.latency = Date.now() - this._lastPing;

            this._onMessage(e.data, 'in');
            return wsReceive.call(socket, e);
        };
    }

    _startPingPong(socket) {
        this._pingPong = setInterval(() => {
            this._lastPing = Date.now();
            socket.send('ping');
        }, 5000);

        pn.on('disconnect', () => {
            clearInterval(this._pingPong);
        });
    }

    async _onMessage(data, type) {
        if (data === 'ping' || data === 'pong') return;

        this._bandwidth[type].current += new Blob([data]).size;
        this._updateBandwidth(type);
    }

    _updateBandwidth(type) {
        const now = Date.now();

        if (now - this._bandwidth[type].lastCheck > 1000) {
            this._bandwidth[type].saved = this._bandwidth[type].current;
            this._bandwidth[type].current = 0;
            this._bandwidth[type].lastCheck = now;
        }
    }

    _debugPrint() {
        console.log(`Latency: ${this.latency} ms`);
        console.log(`Bandwidth: ${this.bandwidthIn} B/s in, ${this.bandwidthOut} B/s out`);
    }
}
