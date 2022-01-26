import parsers from "./parsers.js";
import equal from 'fast-deep-equal';
import { deleteEmptyObjects, roundTo } from "./utils.js";

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

NetworkEntity.prototype.initialize = function () {
    this._pathParts = {};
    this.cachedState = {};

    // special rules
    this.rules = {
        'position': () => {
            const value = this.entity.getPosition();
            return { x: roundTo(value.x, 2), y: roundTo(value.y, 2), z: roundTo(value.z, 2) };
        },
        'rotation': () => {
            const value = this.entity.getRotation();
            return { x: roundTo(value.x, 2), y: roundTo(value.y, 2), z: roundTo(value.z, 2), w: roundTo(value.w, 2) };
        },
        'scale': () => {
            const value = this.entity.getLocalScale();
            return { x: roundTo(value.x, 2), y: roundTo(value.y, 2), z: roundTo(value.z, 2) };
        }
    };

    this.app.fire('networkEntities:create', this);
};

NetworkEntity.prototype.swap = function (old) {
    this._pathParts = old._pathParts;
    this.cachedState = old.cachedState;
    this.rules = old.rules;
    this.parsers = old.parsers;
};

NetworkEntity.prototype.propertyAdd = function (path) {
    if (this.properties.findIndex(p => p.path == path) === -1)
        return;

    this.properties.push({ path });
};

NetworkEntity.prototype.propertyRemove = function (path) {
    const ind = this.properties.findIndex(p => p.path == path);
    if (this.id === -1) return;
    this.properties.splice(ind, 1);
};

NetworkEntity.prototype.getState = function () {
    let state = {};

    for (let i = 0; i < this.properties.length; i++) {
        const path = this.properties[i].path;
        const parts = this._makePathParts(path);
        const rule = this.rules[path];

        let node = this.entity;
        let cachedStateNode = this.cachedState;
        let stateNode = state;

        for (let p = 0; p < parts.length; p++) {
            let part = parts[p];
            let value = null;

            if (p === (parts.length - 1)) {
                if (rule) {
                    value = rule();
                } else if (typeof (node[part]) === 'object' && node[part]) {
                    const parser = parsers.get(node[part].constructor);
                    if (!parser) continue;
                    value = parser(node[part]);
                } else {
                    value = node[part];
                }

                if (!equal(value, cachedStateNode[part])) {
                    stateNode[part] = value;
                    cachedStateNode[part] = value;
                }
            } else {
                if (!cachedStateNode[part])
                    cachedStateNode[part] = {};

                if (!stateNode[part])
                    stateNode[part] = {};

                if (typeof(node[part]) === 'function') {
                    node = node[part]();
                } else {
                    node = node[part];
                }

                cachedStateNode = cachedStateNode[part];
                stateNode = stateNode[part];
            }
        }
    }

    deleteEmptyObjects(state);

    if (Object.keys(state).length === 0)
        return null;

    state.id = this.id;
    state.owner = this.owner;

    return state;
};

NetworkEntity.prototype._makePathParts = function (path) {
    let parts = this._pathParts[path];
    if (!parts) {
        parts = path.split('.');
        this._pathParts[path] = parts;
    }
    return parts;
};
