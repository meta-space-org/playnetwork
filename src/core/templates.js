/* eslint-disable no-var */
import fs from 'fs/promises';
import chokidar from 'chokidar';

class Templates {
    cache = new Map();
    cacheJson = new Map();
    index = new Map();
    indexByPath = new Map();
    cacheRaw = null;
    logging = true;

    async initialize(directory) {
        this.directory = directory;

        // hot-reloading of templates
        this.watch();

        pc.ComponentSystem.prototype.addComponent = function addComponent(entity, data) {
            if (data === 0) {
                data = {};
            }

            var component = new this.ComponentType(this, entity);
            var componentData = new this.DataType();
            this.store[entity.getGuid()] = {
                entity: entity,
                data: componentData
            };
            component.originalData = data;
            entity[this.id] = component;
            entity.c[this.id] = component;
            this.initializeComponentData(component, data, []);
            this.fire('add', entity, component);
            return component;
        };

        pc.Entity.prototype._cloneRecursively = function _cloneRecursively(duplicatedIdsMap) {
            var clone = new pc.Entity(this._app);

            pc.GraphNode.prototype._cloneInternal.call(this, clone);

            for (var type in this.c) {
                var component = this.c[type];
                component.system.cloneComponent(this, clone);
                clone[type].originalData = component.originalData;
            }

            for (var i = 0; i < this._children.length; i++) {
                var oldChild = this._children[i];

                if (oldChild instanceof pc.Entity) {
                    var newChild = oldChild._cloneRecursively(duplicatedIdsMap);

                    clone.addChild(newChild);
                    duplicatedIdsMap[oldChild.getGuid()] = newChild;
                }
            }

            return clone;
        };

        pc.Template.prototype.instantiate = function instantiate(app) {
            if (app) {
                this._app = app;
            }

            this._parseTemplate();

            return this._templateRoot.clone();
        };
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
            this.cacheRaw = [];
            for (const [_, data] of this.cacheJson.entries()) {
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
            for (let i = 0; i < json.tags.length; i++) {
                asset.tags.add(json.tags[i]);
            }

            this.index.set(asset.id, asset);
            this.indexByPath.set(fullPath, asset);
            this.cache.set(fullPath, data);
            this.cacheJson.set(fullPath, json);
            this.cacheRaw = null;

            if (this.logging) console.log('new template asset', fullPath);
            return asset;
        } catch (ex) {
            console.log('failed creating asset', fullPath);
            console.error(ex);
        }

        return null;
    }

    // watches directory for file changes, to hand template reloading
    watch() {
        const watcher = chokidar.watch(this.directory);

        watcher
            .on('add', async (path) => this.loadTemplate(path))
            .on('change', async (path) => this.loadTemplate(path))
            .on('unlink', async (path) => {
                const asset = this.indexByPath.get(path);
                if (asset) this.index.delete(asset.id);
                this.indexByPath.delete(path);
                this.cache.delete(path);
                this.cacheJson.delete(path);
                this.cacheRaw = null;
                if (this.logging) console.log('removed template: ', path);
            });
    }

    async loadTemplate(path) {
        let data = await fs.readFile(path);
        data = data.toString();

        if (this.cache.get(path) === data)
            return;

        try {
            const asset = this.getByPath(path);
            if (asset) {
                if (this.logging) console.log('reloading template: ', path);

                // update existing
                try {
                    const json = JSON.parse(data);
                    asset._resources = [];
                    asset.data = json.data;
                    asset.loaded = false;
                    this.cache.set(path, data);
                    this.cacheJson.set(path, json);
                    this.cacheRaw = null;
                } catch (ex) {
                    console.log('failed updating template: ', path);
                    console.error(ex);
                }
            } else {
                try {
                    // load new
                    this.createAsset(data, path);
                } catch (ex) {
                    console.log('failed hot-loading template: ', path);
                    console.error(ex);
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    }
}

export default new Templates();
