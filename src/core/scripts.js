import vm from 'vm';
import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';

const vecLookup = [undefined, undefined, Vec2, Vec3, Vec4];

function rawToValue(app, args, value, old) {
    switch (args.type) {
        case 'boolean':
            return !!value;

        case 'number':
            if (typeof value === 'number') {
                return value;
            } else if (typeof value === 'string') {
                var v = parseInt(value, 10);
                if (isNaN(v)) return null;
                return v;
            } else if (typeof value === 'boolean') {
                return 0 + value;
            }

            return null;

        case 'json':
            {
                var result = {};

                if (Array.isArray(args.schema)) {
                    if (!value || typeof value !== 'object') {
                        value = {};
                    }

                    for (var i = 0; i < args.schema.length; i++) {
                        var field = args.schema[i];
                        if (!field.name) continue;

                        if (field.array) {
                            result[field.name] = [];
                            var arr = Array.isArray(value[field.name]) ? value[field.name] : [];

                            for (var j = 0; j < arr.length; j++) {
                                result[field.name].push(rawToValue(app, field, arr[j]));
                            }
                        } else {
                            var val = value.hasOwnProperty(field.name) ? value[field.name] : field.default;
                            result[field.name] = rawToValue(app, field, val);
                        }
                    }
                }

                return result;
            }

        case 'asset':
            if (value instanceof global.pc.Asset) {
                return value;
            } else if (typeof value === 'number') {
                return app.assets.get(value) || value;
            } else if (typeof value === 'string') {
                return app.assets.get(parseInt(value, 10)) || parseInt(value, 10);
            }

            return null;

        case 'entity':
            if (value instanceof global.pc.GraphNode) {
                return value;
            } else if (typeof value === 'string') {
                return app.getEntityFromIndex(value);
            }

            return null;

        case 'rgb':
        case 'rgba':
            if (value instanceof global.pc.Color) {
                if (old instanceof global.pc.Color) {
                    old.copy(value);
                    return old;
                }

                return value.clone();
            } else if (value instanceof Array && value.length >= 3 && value.length <= 4) {
                for (var _i = 0; _i < value.length; _i++) {
                    if (typeof value[_i] !== 'number') return null;
                }

                if (!old) old = new global.pc.Color();
                old.r = value[0];
                old.g = value[1];
                old.b = value[2];
                old.a = value.length === 3 ? 1 : value[3];
                return old;
            } else if (typeof value === 'string' && /#([0-9abcdef]{2}){3,4}/i.test(value)) {
                if (!old) old = new global.pc.Color();
                old.fromString(value);
                return old;
            }

            return null;

        case 'vec2':
        case 'vec3':
        case 'vec4':
            {
                var len = parseInt(args.type.slice(3), 10);
                var vecType = vecLookup[len];

                if (value instanceof vecType) {
                    if (old instanceof vecType) {
                        old.copy(value);
                        return old;
                    }

                    return value.clone();
                } else if (value instanceof Array && value.length === len) {
                    for (var _i2 = 0; _i2 < value.length; _i2++) {
                        if (typeof value[_i2] !== 'number') return null;
                    }

                    if (!old) old = new vecType();

                    for (var _i3 = 0; _i3 < len; _i3++) {
                        old[components[_i3]] = value[_i3];
                    }

                    return old;
                }

                return null;
            }

        case 'curve':
            if (value) {
                var curve;

                if (value instanceof global.pc.Curve || value instanceof global.pc.CurveSet) {
                    curve = value.clone();
                } else {
                    var CurveType = value.keys[0] instanceof Array ? global.pc.CurveSet : global.pc.Curve;
                    curve = new CurveType(value.keys);
                    curve.type = value.type;
                }

                return curve;
            }

            break;
    }

    return value;
}

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

        global.pc.ScriptAttributes.prototype.add = function add(name, args) {
			if (this.index[name]) {
				return;
			} else if (global.pc.ScriptAttributes.reservedNames.has(name)) {
				return;
			}

			this.index[name] = args;
			Object.defineProperty(this.scriptType.prototype, name, {
				get: function get() {
					return this.__attributes[name];
				},
				set: function set(raw) {
					var evt = 'attr';
					var evtName = 'attr:' + name;
					var old = this.__attributes[name];
					var oldCopy = old;

					if (old && args.type !== 'json' && old.clone) {
						if (this._callbacks[evt] || this._callbacks[evtName]) {
							oldCopy = old.clone();
						}
					}

					if (args.array) {
						this.__attributes[name] = [];

						if (raw) {
							for (var i = 0, len = raw.length; i < len; i++) {
								this.__attributes[name].push(rawToValue(this.app, args, raw[i], old ? old[i] : null));
							}
						}
					} else {
						this.__attributes[name] = rawToValue(this.app, args, raw, old);
					}

					this.fire(evt, name, this.__attributes[name], oldCopy);
					this.fire(evtName, this.__attributes[name], oldCopy);
				}
			});
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