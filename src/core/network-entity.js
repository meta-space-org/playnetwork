import parsers from "./parsers.js";

var NetworkEntity = pc.createScript('networkEntity');

NetworkEntity.attributes.add('syncInterval', { type: 'number', default: 1 });
NetworkEntity.attributes.add('id', { type: 'number', default: -1 });
NetworkEntity.attributes.add('owner', { type: 'string' });
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

    this.app.fire('networkEntities:create', this);
};

NetworkEntity.prototype.swap = function(old) {
    this._pathParts = old._pathParts;
    this.state = old.state;
    this.rules = old.rules;
    this.parsers = old.parsers;
};

NetworkEntity.prototype.propertyAdd = function(path) {
    if (this.properties.findIndex(p => p.path == path) === -1)
        return;

    this.properties.push({ path });
};

NetworkEntity.prototype.propertyRemove = function(path) {
    const ind = this.properties.findIndex(p => p.path == path);
    if (this.id === -1) return;
    this.properties.splice(ind, 1);
};

NetworkEntity.prototype.getState = function() {
    this.state.id = this.id;
    this.state.owner = this.owner;

    for(let i = 0; i < this.properties.length; i++) {
        const path = this.properties[i].path;
        const parts = this._makePathParts(path);
        const rule = this.rules[path];

        let node = this.entity;
        let stateNode = this.state;

        for(let p = 0; p < parts.length; p++) {
            let part = parts[p];

            if (p === (parts.length - 1)) {
                if (rule) {
                    stateNode[part] = rule();
                } else if (typeof(node[part]) === 'object' && node[part]) {
                    const parser = parsers.get(node[part].constructor);
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
