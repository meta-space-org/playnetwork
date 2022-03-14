import { roundTo } from './utils.js';

class Measurement {
    constructor() {
        this.startTimestamp = Date.now();

        this.in = 0;
        this.out = 0;
    }

    add(type, bytes) {
        this[type] += bytes / 1000;
    }

    getAverage() {
        let duration = Date.now() - this.startTimestamp;
        if (duration <= 0) return { bytes: 0, packets: 0 };
        duration /= 1000;

        return { in: roundTo(this.in / duration, 3), out: roundTo(this.out / duration, 3) };
    }
}

class Performance {
    constructor() {
        this.measurement = new Measurement();

        this.users = new Map();
        this.rooms = new Map();
        this.players = new Map();
        this.networkEntities = new Map();

        setInterval(() => this._debugPrint(), 1000);
    }

    add(socket) {
        const wsSend = socket.send;
        socket.send = async (data) => {
            this._onMessage(data, socket.user, 'out');
            return wsSend.call(socket, data);
        };

        socket.on('message', async (e) => {
            if (e.data === 'ping') socket.send('pong');
            this._onMessage(e.data, socket.user, 'in');
        });

        this._createMeasurement(this.users, socket.user.id);
    }

    async _onMessage(data, user, type) {
        if (data === 'ping' || data === 'pong') return;

        const messageSize = Buffer.byteLength(data, 'utf-8');
        const msg = JSON.parse(data);

        this.measurement.add(type, messageSize); // Add global measurement
        this.users.get(user.id).add(type, messageSize); // Add user measurement

        const { target, targetId } = this._getTarget(msg);

        if (!target || !targetId) return;

        this._createMeasurement(target, targetId);
        target.get(targetId).add(type, messageSize); // Add scope measurement
    }

    _getTarget(msg) {
        switch (msg.scope.type) {
            case 'room': return { target: this.rooms, targetId: msg.scope.id };
            case 'player': return { target: this.players, targetId: msg.scope.id };
            case 'networkEntity': return { target: this.networkEntities, targetId: msg.scope.id };
            default: return { target: null, targetId: null };
        }
    }

    _createMeasurement(target, id) {
        if (target.has(id)) return;
        target.set(id, new Measurement());
    }

    _debugPrint() {
        console.log('\nPERFORMANCE');

        const avg = this.measurement.getAverage();
        console.log(`Global Bandwidth: In (${avg.in} KB/s), Out (${avg.out} KB/s)`);

        for (const [id, measurement] of this.users) {
            const avg = measurement.getAverage();
            console.log(`User ${id}: In (${avg.in} KB/s), Out (${avg.out} KB/s)`);
        }

        for (const [id, measurement] of this.rooms) {
            const avg = measurement.getAverage();
            console.log(`Room ${id}: In (${avg.in} KB/s), Out (${avg.out} KB/s)`);
        }
    }
}

export default new Performance();
