import * as pc from 'playcanvas';

import { roundTo } from '../libs/utils.js';

/**
 * @class Performance
 * @classdesc Helper class to collect performance data.
 * @property {object} bandwidth Current bandwidth.
 * @property {number} bandwidth.in Inbound bandwidth B/s.
 * @property {number} bandwidth.out Outbound bandwidth B/s.
 * @property {number} cpuLoad Current CPU load, 0..1.
 * @property {number} memory Current memory usage, in bytes.
 */
export default class Performance {
    static events = new pc.EventHandler();

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

    static connectSocket(socket) {
        const wsSend = socket.send;
        socket.send = async (data) => {
            Performance.events.fire('message', data, 'out');
            return wsSend.call(socket, data);
        };

        socket.on('message', async (e) => {
            Performance.events.fire('message', e.data, 'in');
        });
    }

    startBandwidthMonitor(scope, scopeId) {
        this._scope = scope;
        this._scopeId = scopeId;

        Performance.events.on('message', this._onMessage, this);
    }

    destroy() {
        Performance.events.off('message', this._onMessage, this);
        clearInterval(this._loadInterval);
    }

    async _onMessage(data, type) {
        if (data === 'ping' || data === 'pong') return;

        const msg = JSON.parse(data);
        if (this._scope && this._scope !== msg.scope.type) return;
        if (this._scopeId && this._scopeId !== msg.scope.id) return;

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
        console.log(`Scope: ${this._scope} ${this._scopeId}`);

        if (this._collectLoad)
            console.log(`CPU load: ${roundTo(this.cpuLoad * 100, 1)}%`);

        console.log(`Memory used: ${roundTo(this.memory / 1024 / 1024, 1)} MB`);
        const bandwidth = this.bandwidth;
        console.log(`Bandwidth: ${bandwidth.in} B/s in, ${bandwidth.out} B/s out\n`);
    }
}
