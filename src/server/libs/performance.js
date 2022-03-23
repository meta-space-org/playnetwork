import * as pc from 'playcanvas';

export default class Performance {
    constructor(onMemoryUpdate) {
        this.events = new pc.EventHandler();

        this.cpuLoad = 0;
        this.memory = 0;

        this.lastCpuLoad = process.cpuUsage();
        this.lastCpuLoadCheck = Date.now();

        this.updateInterval = setInterval(() => {
            const load = process.cpuUsage();
            const loadDelta = (load.user - this.lastCpuLoad.user) + (load.system - this.lastCpuLoad.system);
            const time = Date.now();
            const timeDelta = (time - this.lastCpuLoadCheck) * 1000;

            this.cpuLoad = loadDelta / timeDelta;
            this.memory = onMemoryUpdate();

            this.lastCpuLoad = load;
            this.lastCpuLoadCheck = time;
        }, 2000);
    }

    addCpuLoad(scope) {
        Object.defineProperty(scope, 'cpuLoad', {
            get: () => this.cpuLoad
        });
    }

    addMemoryUsage(scope) {
        Object.defineProperty(scope, 'memory', {
            get: () => this.memory
        });
    }
}
