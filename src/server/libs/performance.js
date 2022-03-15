import { roundTo } from './utils.js';

/**
 * @class Performance
 * @classdesc Helper class to collect performance data.
 * @property {object} bandwidth Current bandwidth.
 * @property {number} bandwidth.in Inbound bandwidth B/s.
 * @property {number} bandwidth.out Outbound bandwidth B/s.
 * @property {number} cpuLoad Current CPU load, 0..1.
 * @property {number} memory Current memory usage, in bytes.
 */

class Performance {
    constructor(settings) {
        this._collectLoad = settings?.collectLoad;

        this.cpuLoad = 0;

        this._mesagesIn = [];
        this._mesagesOut = [];

        if (!this._collectLoad) return this;

        this._lastLoad = process.cpuUsage();
        this._lastTime = performance.now();

        this._loadInterval = setInterval(() => {
            const load = process.cpuUsage();
            const loadDelta = (load.user - this._lastLoad.user) + (load.system - this._lastLoad.system);
            const time = performance.now();
            const timeDelta = (time - this._lastTime) * 1000;

            this.cpuLoad = loadDelta / timeDelta;

            this._lastLoad = load;
            this._lastTime = time;
        }, 2500);
    }

    get memory() {
        return process.memoryUsage.rss();
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
        // TODO: add scope for socket
        const wsSend = socket.send;
        socket.send = async (data) => {
            this._onMessage(data, 'out');
            return wsSend.call(socket, data);
        };

        socket.on('message', async (e) => {
            this._onMessage(e.data, 'in');
        });
    }

    destroy() {
        clearInterval(this._loadInterval);
    }

    async _onMessage(data, type) {
        if (data === 'ping' || data === 'pong') return;

        const timestamp = performance.now();
        const messageSize = Buffer.byteLength(data, 'utf-8');

        let storage = type === 'in' ? this._mesagesIn : this._mesagesOut;

        storage.push({
            timestamp,
            size: messageSize
        });

        storage = storage.filter(m => m.timestamp > timestamp - 1000);

        type === 'in' ? this._mesagesIn = storage : this._mesagesOut = storage;
    }

    _debugPrint() {
        if (this._collectLoad)
            console.log(`CPU load: ${roundTo(this.cpuLoad * 100, 1)}%`);

        console.log(`Memory used: ${roundTo(this.memory / 1024 / 1024, 1)} MB`);
        const bandwidth = this.bandwidth;
        console.log(`Bandwidth: ${bandwidth.in} B/s in, ${bandwidth.out} B/s out\n`);
    }
}

export default Performance;
