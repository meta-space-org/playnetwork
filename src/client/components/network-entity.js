// Network entity is used to sync entity state between server and client
var NetworkEntity = pc.createScript('networkEntity');

NetworkEntity.attributes.add('syncInterval', {
    title: 'Sync Interval',
    type: 'number',
    default: 1,
    placeholder: 'ticks',
    description: 'Read-only. Every Nth tick it will synchronize an entity'
});

NetworkEntity.attributes.add('id', {
    title: 'Network ID',
    type: 'number',
    description: 'Read-only. Network ID which is set by server'
});

NetworkEntity.attributes.add('owner', {
    title: 'Owner',
    type: 'string',
    description: 'Read-only. User ID who is controlling an entity'
});

NetworkEntity.attributes.add('properties', {
    title: 'Properties',
    type: 'json',
    array: true,
    description: 'List of property paths to be synchronised',
    schema: [
        { type: 'string', name: 'path' },
        { type: 'boolean', name: 'interpolate' },
        { type: 'boolean', name: 'ignoreForOwner' }
    ]
});

NetworkEntity.prototype.initialize = function () {
    this.mine = this.owner && pn.players.get(this.owner).mine;

    this._pathParts = {};

    this.tmpObjects = new Map();
    this.tmpObjects.set(pc.Vec2, new pc.Vec2());
    this.tmpObjects.set(pc.Vec3, new pc.Vec3());
    this.tmpObjects.set(pc.Vec4, new pc.Vec4());
    this.tmpObjects.set(pc.Quat, new pc.Quat());
    this.tmpObjects.set(pc.Color, new pc.Color());

    this.rules = {
        'position': {
            get: (state) => {
                const tmpObject = this.tmpObjects.get(pc.Vec3);
                this.parsers.get(pc.Vec3)(tmpObject, state.position);
                return tmpObject;
            },
            set: (state) => {
                const data = state.position;

                if (this.entity.rigidbody) {
                    const rotation = this.entity.getEulerAngles();
                    this.entity.rigidbody.teleport(data.x, data.y, data.z, rotation.x, rotation.y, rotation.z);
                } else {
                    this.entity.setPosition(data.x, data.y, data.z);
                }
            }
        },
        'rotation': {
            get: (state) => {
                const tmpObject = this.tmpObjects.get(pc.Quat);
                this.parsers.get(pc.Quat)(tmpObject, state.rotation);
                return tmpObject;
            },
            set: (state) => {
                const data = state.rotation;
                this.entity.setRotation(data.x, data.y, data.z, data.w);

                if (this.entity.rigidbody) {
                    const position = this.entity.getPosition();
                    const rotation = this.entity.getEulerAngles();
                    this.entity.rigidbody.teleport(position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);
                }
            }
        },
        'scale': {
            get: (state) => {
                const tmpObject = this.tmpObjects.get(pc.Vec3);
                this.parsers.get(pc.Vec3)(tmpObject, state.scale);
                return tmpObject;
            },
            set: (state) => {
                const data = state.scale;
                this.entity.setLocalScale(data.x, data.y, data.z);
            }
        }
    };

    this.rulesInterpolate = {
        'position': {
            get: () => {
                return this.entity.getPosition();
            },
            set: (value) => {
                this.entity.setPosition(value);
                if (this.entity.rigidbody) {
                    this.entity.rigidbody.teleport(value.x, value.y, value.z);
                }
            }
        },
        'rotation': {
            get: () => {
                return this.entity.getRotation();
            },
            set: (value) => {
                this.entity.setRotation(value);
                if (this.entity.rigidbody) {
                    let position = this.entity.getPosition();
                    let rotation = this.entity.getEulerAngles();
                    this.entity.rigidbody.teleport(position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);
                }
            }
        },
        'scale': {
            get: () => {
                return this.entity.getLocalScale();
            },
            set: (value) => {
                return this.entity.setLocalScale(value);
            }
        }
    };

    this.rulesReAssignTypes = new Set();
    this.rulesReAssignTypes.add(pc.Vec2);
    this.rulesReAssignTypes.add(pc.Vec3);
    this.rulesReAssignTypes.add(pc.Vec4);
    this.rulesReAssignTypes.add(pc.Quat);
    this.rulesReAssignTypes.add(pc.Color);

    this.parsers = new Map();
    this.parsers.set(pc.Vec2, (value, data) => {
        return value.set(data.x, data.y);
    });
    this.parsers.set(pc.Vec3, (value, data) => {
        return value.set(data.x, data.y, data.z);
    });
    this.parsers.set(pc.Vec4, (value, data) => {
        return value.set(data.x, data.y, data.z, data.w);
    });
    this.parsers.set(pc.Quat, (value, data) => {
        return value.set(data.x, data.y, data.z, data.w);
    });
    this.parsers.set(pc.Color, (value, data) => {
        return value.set(data.r, data.g, data.b, data.a);
    });

    this.interpolations = new Map();

    for (let i = 0; i < this.properties.length; i++) {
        if (!this.properties[i].interpolate)
            continue;

        const path = this.properties[i].path;
        const parts = this._makePathParts(path);
        const rule = this.rulesInterpolate[path];

        let node = this.entity;

        for (let p = 0; p < parts.length; p++) {
            let part = parts[p];

            if (p === (parts.length - 1)) {
                let value;
                let setter;

                if (rule) {
                    value = rule.get();
                    setter = rule.set;
                } else {
                    value = node[part];
                }

                this.interpolations.set(path, new InterpolateValue(value, node, part, setter));
            } else {
                node = node[part];
            }
        }
    }

    this.entity.room.fire('_networkEntities:add', this);
};

NetworkEntity.prototype.swap = function (old) {
    this.mine = old.mine;
    this._pathParts = old._pathParts;
    this.tmpObjects = old.tmpObjects;
    this.rules = old.rules;

    this.rulesReAssignTypes = old.rulesReAssignTypes;
    this.rulesInterpolate = old.rulesInterpolate;
    this.parsers = old.parsers;

    this.interpolations = old.interpolations;
};

NetworkEntity.prototype.setState = function (state) {
    for (let i = 0; i < this.properties.length; i++) {
        if (this.mine && this.properties[i].ignoreForOwner)
            continue;

        const path = this.properties[i].path;
        const parts = this._makePathParts(path);
        const rule = this.rules[path];
        const interpolator = this.interpolations.get(path);

        if (rule && state[path] !== undefined) {
            if (interpolator) {
                const interpolatorRule = this.rulesInterpolate[path];
                if (interpolatorRule) {
                    interpolator.add(rule.get(state));
                    continue;
                }
            }

            rule.set(state);
            continue;
        }

        let node = this.entity;
        let stateNode = state;

        for (let p = 0; p < parts.length; p++) {
            let part = parts[p];

            if (stateNode[part] === undefined)
                continue;

            if (p === (parts.length - 1)) {
                if (typeof (node[part]) === 'object') {
                    const parser = this.parsers.get(node[part].constructor);

                    if (parser) {
                        if (interpolator) {
                            const tmpObject = this.tmpObjects.get(node[part].constructor);
                            parser(tmpObject, stateNode[part]);
                            interpolator.add(tmpObject);
                        } else {
                            if (this.rulesReAssignTypes.has(node[part].constructor)) {
                                node[part] = parser(node[part], stateNode[part]);
                            } else {
                                parser(node[part], stateNode[part]);
                            }
                        }
                    } else if (node[part].constructor === Object) {
                        node[part] = stateNode[part];
                    } else {
                        // unknown property type, cannot set
                        continue;
                    }
                } else {
                    node[part] = stateNode[part];
                }
            } else {
                if (!node[part] || typeof (node[part]) === 'function')
                    continue;

                node = node[part];
                stateNode = stateNode[part];
            }
        }
    }
};

NetworkEntity.prototype._makePathParts = function (path) {
    let parts = this._pathParts[path];
    if (!parts) {
        parts = path.split('.');
        this._pathParts[path] = parts;
    }
    return parts;
};

NetworkEntity.prototype.update = function (dt) {
    for (const [_, interpolator] of this.interpolations) {
        interpolator.update(dt);
    }
};