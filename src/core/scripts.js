import vm from 'vm';
import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';


class Scripts {
    directory = './src/components';
    sources = new Map();

    constructor() { }

    async initialize() {
        // global script registry
        this.registry = new pc.ScriptRegistry();

        // pc.createScript should be modified
        // to add scripts to a global scripts registry instead of individual Applications
        const createScript = global.pc.createScript;
        const mockApp = { scripts: this.registry };
        global.pc.createScript = function(name) {
            return createScript(name, mockApp);
        };

        // load all script components
        await this.loadDirectory(this.directory);

        // hot-reloading watcher
        this.watch();
    }

    // load all scripts
    async loadDirectory(directoryPath) {
        try {
            const items = await fs.readdir(directoryPath);

            for(let i = 0; i < items.length; i++) {
                const fullPath = path.join(directoryPath, items[i]).replace(/\\/g, '/');
                const stats = await fs.stat(fullPath);

                if (stats.isFile()) {
                    const data = await fs.readFile(fullPath);
                    this.sources.set(path.resolve(fullPath), data.toString());

                    let filePath = fullPath.replace('src/components/', '');
                    await import('../components/' + filePath);
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
