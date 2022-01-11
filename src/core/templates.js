import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';

class Templates {
    cache = new Map();
    cacheJson = new Map();
    index = new Map();
    indexByPath = new Map();
    cacheRaw = null;
    logging = false;

    constructor() { }

    async initialize(directory) {
        this.directory = directory;
        // load all templates
        await this.loadDirectory();

        // hot-reloading of templates
        this.watch();
    }

    // get asset by ID
    get(id) {
        return this.index.get(id);
    }

    getByPath(fullPath) {
        return this.indexByPath.get(fullPath);
    }

    // get all template assets as a stringified JSON
    toData() {
        if (this.cacheRaw === null) {
            this.cacheRaw = [ ];
            for(let [ind, data] of this.cacheJson.entries()) {
                this.cacheRaw.push(data);
            }
        }

        return this.cacheRaw;
    }

    createAsset(data, fullPath) {
        try {
            const json = JSON.parse(data);
            const asset = new pc.Asset(json.name, json.type, null, json.data);
            // id
            asset.id = json.id;
            asset.preload = true;
            // tags
            for(let i = 0; i < json.tags.length; i++) {
                asset.tags.add(json.tags[i]);
            }

            this.index.set(asset.id, asset);
            this.indexByPath.set(fullPath, asset);
            this.cache.set(fullPath, data);
            this.cacheJson.set(fullPath, json);
            this.cacheRaw = null;

            if (this.logging) console.log('new template asset', fullPath);
            return asset;
        } catch(ex) {
            console.log('failed creating asset', fullPath);
            console.error(ex);
        }

        return null;
    }

    async loadDirectory() {
        try {
            const items = await fs.readdir(this.directory);

            for(let i = 0; i < items.length; i++) {
                const fullPath = path.resolve(this.directory, items[i]);
                const stats = await fs.stat(fullPath);

                if (stats.isFile()) {
                    try {
                        const data = await fs.readFile(fullPath);
                        this.createAsset(data.toString(), fullPath);
                    } catch(ex) {
                        console.log('failed loading template', fullPath);
                        console.error(ex);
                    }
                } else if (stats.isDirectory()) {
                    await this.loadDirectory(fullPath);
                }
            }
        } catch(ex) {
            console.error(ex);
        }
    }

    // watches directory for file changes, to hand template reloading
    watch() {
        watch(this.directory, async (eventType, filePath) => {
            const fullPath = path.resolve(this.directory, filePath);
            let loadFile = false;

            if (eventType === 'rename') {
                try {
                    let stats = await fs.stat(fullPath);
                    if (stats.isFile()) {
                        // file renamed
                        loadFile = true;
                    }
                } catch(ex) {
                    if (ex.code === 'ENOENT') {
                        // file removed
                        const asset = this.indexByPath.get(fullPath);
                        if (asset) this.index.delete(asset.id);
                        this.indexByPath.delete(fullPath);
                        this.cache.delete(fullPath);
                        this.cacheJson.delete(fullPath);
                        this.cacheRaw = null;
                        if (this.logging) console.log('removed template', fullPath);
                    } else {
                        // unknown error
                        console.error(ex);
                    }
                }
            } else if (eventType === 'change') {
                loadFile = true;
            }

            if (! loadFile)
                return;

            // load file
            let data = await fs.readFile(fullPath);
            data = data.toString();

            if (this.cache.get(fullPath) === data)
                return;

            try {
                const asset = this.getByPath(fullPath);
                if (asset) {
                    if (this.logging) console.log('reloading template:', fullPath);

                    // update existing
                    try {
                        let json = JSON.parse(data);
                        asset._resources = [ ];
                        asset.data = json.data;
                        asset.loaded = false;
                        this.cache.set(fullPath, data);
                        this.cacheJson.set(fullPath, json);
                        this.cacheRaw = null;
                    } catch(ex) {
                        console.log('failed updating template', fullPath);
                        console.error(ex);
                    }
                } else {
                    try {
                        // load new
                        this.createAsset(data, fullPath);
                    } catch(ex) {
                        console.log('failed hot-loading template', fullPath);
                        console.error(ex);
                    }
                }
            } catch(ex) {
                console.error(ex);
            }
        });
    }
}

export default new Templates();
