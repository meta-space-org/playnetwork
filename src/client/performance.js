/**
 * @class Performance
 * @classdesc Helper class to collect performance data.
 * @property {number} latency Current latency ms.
 * @property {object} bandwidth Current bandwidth.
 * @property {number} bandwidth.in Inbound bandwidth B/s.
 * @property {number} bandwidth.out Outbound bandwidth B/s.
 */

class Performance {
    constructor() {
        this.latency = 0;

        this._mesagesIn = [];
        this._mesagesOut = [];
    }

    get bandwidth() {
        const timestamp = performance.now();

        this._mesagesIn = this._mesagesIn.filter(m => m.timestamp > timestamp - 1000);
        this._mesagesOut = this._mesagesOut.filter(m => m.timestamp > timestamp - 1000);

        return {
            in: this._mesagesIn.reduce((sum, m) => sum + m.size, 0),
            out: this._mesagesOut.reduce((sum, m) => sum + m.size, 0)
        };
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
                this.latency = performance.now() - this._lastPing;

            this._onMessage(e.data, 'in');
            return wsReceive.call(socket, e);
        };
    }

    _startPingPong(socket) {
        this._pingPong = setInterval(() => {
            this._lastPing = performance.now();
            socket.send('ping');
        }, 5000);

        pn.on('disconnect', () => {
            clearInterval(this._pingPong);
        });
    }

    async _onMessage(data, type) {
        if (data === 'ping' || data === 'pong') return;

        const timestamp = performance.now();
        const messageSize = new Blob([data]).size;

        let storage = type == 'in' ? this._mesagesIn : this._mesagesOut;

        storage.push({
            timestamp,
            size: messageSize
        });

        storage = storage.filter(m => m.timestamp > timestamp - 1000);

        type == 'in' ? this._mesagesIn = storage : this._mesagesOut = storage;
    }

    _debugPrint() {
        console.log(`Latency: ${this.latency} ms`);
        const bandwidth = this.bandwidth;
        console.log(`Bandwidth: ${bandwidth.in} B/s in, ${bandwidth.out} B/s out`);
    }
}
