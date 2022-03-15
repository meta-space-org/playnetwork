import equal from 'fast-deep-equal';
import parsers from './parsers.js';
import { roundTo } from './../../../libs/utils.js';

const NetworkEntity = pc.createScript('networkEntity');

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
    this.entity.networkEntity = this;
    this.player = this.app.room.getPlayerById(this.owner);

    this._pathParts = {};
    this.cachedState = {};
    this.invalidPaths = new Set();

    // special rules
    this.rules = {
        parent: () => {
            return this.entity.parent?.getGuid() || null;
        },
        localPosition: () => {
            const value = this.entity.getLocalPosition();
            return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z) };
        },
        localRotation: () => {
            const value = this.entity.getLocalRotation();
            return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z), w: roundTo(value.w) };
        },
        position: () => {
            const value = this.entity.getPosition();
            return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z) };
        },
        rotation: () => {
            const value = this.entity.getRotation();
            return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z), w: roundTo(value.w) };
        },
        scale: () => {
            const value = this.entity.getLocalScale();
            return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z) };
        }
    };
};

NetworkEntity.prototype.postInitialize = function() {
    this.app.fire('_networkEntities:create', this);
};

NetworkEntity.prototype.swap = function(old) {
    this._pathParts = old._pathParts;
    this.cachedState = old.cachedState;
    this.rules = old.rules;
    this.parsers = old.parsers;
};

NetworkEntity.prototype.propertyAdd = function(path) {
    if (this.properties.findIndex(p => p.path === path) === -1)
        return;

    this.properties.push({ path });
};

NetworkEntity.prototype.propertyRemove = function(path) {
    const ind = this.properties.findIndex(p => p.path === path);
    if (this.id === -1) return;
    this.properties.splice(ind, 1);
};

NetworkEntity.prototype.getState = function(force) {
    const state = {};

    for (let i = 0; i < this.properties.length; i++) {
        const path = this.properties[i].path;
        const parts = this._makePathParts(path);
        const rule = this.rules[path];

        let node = this.entity;
        let cachedStateNode = this.cachedState;
        let stateNode = state;

        for (let p = 0; p < parts.length; p++) {
            const part = parts[p];

            if (!rule && (node === null || node === undefined || node === {} || node[part] === undefined)) {
                if (!this.invalidPaths.has(path)) {
                    console.warn(`Network entity "${this.entity.name}", id: ${this.id}. Property path "${path}" is leading to unexisting data`);
                    this.invalidPaths.add(path);
                }

                break;
            }

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

                if (force || !equal(value, cachedStateNode[part])) {
                    cachedStateNode[part] = value;

                    for (let i = 0; i < p; i++) {
                        if (!stateNode[parts[i]])
                            stateNode[parts[i]] = {};

                        stateNode = stateNode[parts[i]];
                    }

                    stateNode[part] = value;
                }
            } else {
                if (!cachedStateNode[part])
                    cachedStateNode[part] = {};

                if (typeof (node[part]) === 'function') {
                    node = node[part]();
                } else {
                    node = node[part];
                }

                cachedStateNode = cachedStateNode[part];
            }
        }
    }

    if (Object.keys(state).length === 0)
        return null;

    state.id = this.id;
    state.owner = this.owner;

    return state;
};

NetworkEntity.prototype.send = function(name, data) {
    for (const player of this.app.room.players) {
        player.user._send(name, data, 'networkEntity', this.id);
    }
};

NetworkEntity.prototype._makePathParts = function(path) {
    let parts = this._pathParts[path];
    if (!parts) {
        parts = path.split('.');
        this._pathParts[path] = parts;
    }
    return parts;
};
