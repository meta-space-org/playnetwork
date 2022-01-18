var NetworkEntity = pc.createScript('networkEntity');

NetworkEntity.attributes.add('syncInterval', { type: 'number', default: 1 });
NetworkEntity.attributes.add('id', { type: 'number', default: -1 });
NetworkEntity.attributes.add('owner', { type: 'string' });
NetworkEntity.attributes.add('properties', { type: 'string', array: true });
NetworkEntity.attributes.add('interpolate', { type: 'string', array: true });

NetworkEntity.prototype.initialize = function() {
    this._pathParts = { };
    this.state = {
        id: this.id,
        owner: this.owner
    };

    // special rules
    this.rules = {
        'position': () => {
            const value = this.entity.getPosition();
            return { x: value.x, y: value.y, z: value.z };
        },
        'rotation': () => {
            const value = this.entity.getRotation();
            return { x: value.x, y: value.y, z: value.z, w: value.w };
        },
        'scale': () => {
            const value = this.entity.getLocalScale();
            return { x: value.x, y: value.y, z: value.z };
        }
    };

    // parsers
    this.parsers = new Map();

    this.parsers.set(pc.Vec2, (data) => {
        return { x: data.x, y: data.y };
    });
    this.parsers.set(pc.Vec3, (data) => {
        return { x: data.x, y: data.y, z: data.z };
    });
    this.parsers.set(pc.Vec4, (data) => {
        return { x: data.x, y: data.y, z: data.z, w: data.w };
    });
    this.parsers.set(pc.Quat, (data) => {
        return { x: data.x, y: data.y, z: data.z, w: data.w };
    });
    this.parsers.set(pc.Color, (data) => {
        return { r: data.r, g: data.g, b: data.b, a: data.a };
    });

    this.entity._app.fire('networkEntities:create', this);
};

NetworkEntity.prototype.swap = function(old) {
    this._pathParts = old._pathParts;
    this.state = old.state;
    this.rules = old.rules;
    this.parsers = old.parsers;
};

NetworkEntity.prototype.propertyAdd = function(name) {
    if (this.properties.indexOf(name) === -1)
        return;

    this.properties.push(name);
};

NetworkEntity.prototype.propertyRemove = function(name) {
    const ind = this.properties.indexOf(name);
    if (this.id === -1) return;
    this.properties.splice(ind, 1);
};

NetworkEntity.prototype.getState = function() {
    this.state.id = this.id;
    this.state.owner = this.owner;

    for(let i = 0; i < this.properties.length; i++) {
        const path = this.properties[i];
        const parts = this._makePathParts(path);
        const rule = this.rules[path];

        let node = this.entity;
        let stateNode = this.state;

        for(let p = 0; p < parts.length; p++) {
            let part = parts[p];

            if (p === (parts.length - 1)) {
                if (rule) {
                    stateNode[part] = rule();
                } else if (typeof(node[part]) === 'object') {
                    const parser = this.parsers.get(node[part].constructor);
                    if (! parser) continue;
                    stateNode[part] = parser(node[part]);
                } else {
                    stateNode[part] = node[part];
                }
            } else {
                if (! stateNode[part])
                    stateNode[part] = { };

                if (typeof(node[part]) === 'function') {
                    node = node[part]();
                } else {
                    node = node[part];
                }

                stateNode = stateNode[part];
            }
        }
    }

    return this.state;
};

NetworkEntity.prototype._makePathParts = function(path) {
    let parts = this._pathParts[path];
    if (! parts) {
        parts = path.split('.');
        this._pathParts[path] = parts;
    }
    return parts;
};
