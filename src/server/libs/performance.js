import * as pc from 'playcanvas';

class Performance extends pc.EventHandler {
    constructor() {
        super();

        this._pingIds = 1;

        this._cpuLoad = 0;
        this._lastCpuLoad = process.cpuUsage();
        this._lastCpuLoadCheck = Date.now();

        this._memory = 0;

        this._updateInterval = setInterval(() => {
            const load = process.cpuUsage();
            const loadDelta = (load.user - this._lastCpuLoad.user) + (load.system - this._lastCpuLoad.system);
            const time = Date.now();
            const timeDelta = (time - this._lastCpuLoadCheck) * 1000;

            this._cpuLoad = loadDelta / timeDelta;
            this._lastCpuLoad = load;
            this._lastCpuLoadCheck = time;

            this._memory = process.memoryUsage.rss();
        }, 1000);
    }

    addCpuLoad(scope) {
        Object.defineProperty(scope, 'cpuLoad', { get: () => this._cpuLoad, configurable: true });
    }

    addMemoryUsage(scope) {
        Object.defineProperty(scope, 'memory', { get: () => this._memory, configurable: true });
    }

    addLatency(user) {
        user.latency = 0;

        user._pings = new Map();
        user._pingInterval = setInterval(() => {
            const id = this._pingIds++;
            user._pings.set(id, { scope: user, timestamp: Date.now() });
            user.send('_ping', { id, l: user.latency }, 'user');
        }, 1000);

        user.on('_pong', (from, id) => {
            if (from !== user) return;

            const ping = user._pings.get(id);
            if (!ping) return;

            user.latency = Date.now() - ping.timestamp;
            user._pings.delete(id);
        });
    }

    addRoomLatency(room) {
        room._lastPings = 0;
        room._pings = new Map();

        room.on('_pong', (user) => {
            const ping = room._pings.get(user.id);
            if (ping) ping.pong = true;
        });
    }

    handlePings(room) {
        const lastPings = room._lastPings;
        const now = Date.now();

        for (const ping of room._pings.values()) {
            if (!ping.pong || ping.latency) continue;
            ping.latency = now - ping.timestamp;
        }

        if (now - lastPings < 1000) return;

        for (const user of room.users.values()) {
            const lastPing = room._pings.get(user.id);
            if (lastPing && !lastPing.pong) continue;

            const ping = { timestamp: now, pong: false, latency: 0, roomId: room.id };
            room._pings.set(user.id, ping);

            user.send('_ping', { r: room.id, l: lastPing?.latency || 0 });
        }

        room._lastPings = now;
    }

    removeLatency(user) {
        clearInterval(user._pingInterval);
        user.off('_pong');
        delete user._pingInterval;
        delete user._pings;
        delete user.latency;
    }

    removeRoomLatency(room) {
        room.off('_pong');
        delete room._pings;
        delete room._lastPings;
    }
}

export default new Performance();
