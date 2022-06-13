/**
 * @class Levels
 * @classdesc Interface that allows to save hierarchy data to a server.
 */

class Levels {
    constructor() {
        this._rootsByRoom = new Map();

        Object.defineProperty(pc.Entity.prototype, "room", {
            get: function() {
                if (!this._room) {
                    let parent = this.parent;
                    while (parent && !this._room) {
                        if (parent._room) {
                            this._room = parent._room;
                            break;
                        } else {
                            parent = parent.parent;
                        }
                    }
                }

                return this._room;
            }
        });
    }

    /**
     * @method save
     * @description Save the hierarchy data of a Scene to the server.
     * @param {Number} sceneId ID of a Scene.
     * @param {callback} [callback] Callback of a server response.
     */
    save(sceneId, callback) {
        this._getEditorSceneData(sceneId, (level) => {
            pn.send('_level:save', level, null, callback);
        });
    }

    build(room, level) {
        const sceneRegistryItem = new pc.SceneRegistryItem(level.name, level.item_id);
        sceneRegistryItem.data = level;
        sceneRegistryItem._loading = false;

        for (const root of this._rootsByRoom.values()) {
            root.enabled = false;
        }

        this._loadSceneHierarchy.call(pc.app.scenes, sceneRegistryItem, room, (_, root) => {
            this._rootsByRoom.set(room.id, root);
        });
        pc.app.scenes.loadSceneSettings(sceneRegistryItem, () => { });
    }

    _clear(roomId) {
        const root = this._rootsByRoom.get(roomId);
        if (!root) return;

        root.destroy();
        this._rootsByRoom.delete(roomId);
    }

    _getEditorSceneData(sceneId, callback) {
        pc.app.loader._handlers.scene.load(sceneId.toString(), (err, scene) => {
            if (err) {
                console.error(err);
                return;
            }

            callback(scene);
        });
    }

    _loadSceneHierarchy(sceneItem, room, callback) {
        const self = this;

        // Because we need to load scripts before we instance the hierarchy (i.e. before we create script components)
        // Split loading into load and open
        const handler = this._app.loader.getHandler("hierarchy");

        this._loadSceneData(sceneItem, false, function(err, sceneItem) {
            if (err) {
                if (callback) callback(err);
                return;
            }

            const url = sceneItem.url;
            const data = sceneItem.data;

            // called after scripts are preloaded
            const _loaded = function() {
                self._app.systems.script.preloading = true;
                const entity = handler.open(url, data);

                self._app.systems.script.preloading = false;

                // clear from cache because this data is modified by entity operations (e.g. destroy)
                self._app.loader.clearCache(url, "hierarchy");

                // add to hierarchy
                self._app.root.addChild(entity);

                entity._room = room;
                room.root = entity;

                // initialize components
                self._app.systems.fire('initialize', entity);
                self._app.systems.fire('postInitialize', entity);
                self._app.systems.fire('postPostInitialize', entity);

                if (callback) callback(err, entity);
            };

            // load priority and referenced scripts before opening scene
            self._app._preloadScripts(data, _loaded);
        });
    }
}
