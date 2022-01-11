import vm from 'vm';
import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';


class Scripts {
    sources = new Map();

    constructor() { }

    async initialize(directory) {
        this.directory = directory;
        // global script registry
        this.registry = new pc.ScriptRegistry();

        // pc.createScript should be modified
        // to add scripts to a global scripts registry instead of individual Applications
        const createScript = global.pc.createScript;
        const mockApp = { scripts: this.registry };
        global.pc.createScript = function(name) {
            return createScript(name, mockApp);
        };

        // load network-entity script
        await import(`./network-entity.js`);

        // load all script components
        await this.loadDirectory();

        // hot-reloading watcher
        this.watch();
    }

    // load all scripts
    async loadDirectory() {
        try {
            const items = await fs.readdir(this.directory);

            for(let i = 0; i < items.length; i++) {
                const fullPath = path.join(this.directory, items[i]).replace(/\\/g, '/');
                const stats = await fs.stat(fullPath);

                if (stats.isFile()) {
                    const data = await fs.readFile(fullPath);
                    this.sources.set(path.resolve(fullPath), data.toString());

                    let filePath = fullPath.replace(this.directory, '');
                    await import(`file://${path.resolve()}/${filePath}`); // TODO: Test on Linux
                } else if (stats.isDirectory()) {
                    await this.loadDirectory(fullPath);
                }
            }
        } catch(ex) {
            console.error(ex);
        }
    }

    // watches directory for file changes, to handle code hot-reloading
    watch() {
        watch(this.directory, async (eventType, filePath) => {
            if (eventType !== 'change')
                return;

            const fullPath = path.resolve(this.directory, filePath);
            const data = await fs.readFile(fullPath);
            const source = data.toString();

            if (this.sources.get(fullPath) === source)
                return;

            this.sources.set(fullPath, source);

            console.log('reloading script:', fullPath);

            try {
                vm.runInNewContext(data, global, fullPath);
            } catch(ex) {
                console.error(ex);
            }
        });
    }
}

export default new Scripts();