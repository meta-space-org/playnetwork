import equal from 'fast-deep-equal';
import parsers from './parsers.js';
import { roundTo } from '../libs/utils.js';

/**
 * @class NetworkEntity
 * @classdesc NetworkEntity is a {@link pc.ScriptType}, which is attached to a
 * {@link pc.ScriptComponent} of an {@link pc.Entity} that needs to be
 * synchronised between server and clients. It has unique ID, optional owner and
 * list of properties to be synchronised.
 * @extends pc.ScriptType
 * @property {number} id Unique identifier.
 * @property {Player} player Optional {@link Player} to which this
 * {@link pc.Entity} is related.
 * @property {Object[]} properties List of properties, which should be
 * synchronised and optionally can be interpolated. Each property `object` has
 * these properties:
 *
 *
 * | Param | Type | Description |
 * | --- | --- | --- |
 * | path | `string` | Path to a property. |
 * | interpolate | `boolean` | If value is type of: `number` &#124; `Vec2` &#124; `Vec3` &#124; `Vec4` &#124; `Quat` &#124; `Color`, then it can be interpolated. |
 * | ignoreForOwner | `boolean` | If `true` then server will not send this property updates to an owner. |
 */

/**
 * @event NetworkEntity#*
 * @description {@link NetworkEntity} can receive named networked messaged.
 * @param {object|array|string|number|boolean} [data] Optional data of a message.
 */

const NetworkEntity = pc.createScript('networkEntity');

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

    this.once('destroy', this.onDestroy, this);
};

NetworkEntity.prototype.postInitialize = function() {
    this.app.fire('_networkEntities:create', this);
};

NetworkEntity.prototype.swap = function(old) {
    this.player = old.player;
    this._pathParts = old._pathParts;
    this.cachedState = old.cachedState;
    this.invalidPaths = old.invalidPaths;
    this.rules = old.rules;

    // TODO: remove when playcanvas application will be destroyed properly
    // https://github.com/playcanvas/engine/issues/4135
    old.off('destroy', old.onDestroy, old);
    this.once('destroy', this.onDestroy, this);
};

/**
 * @method send
 * @description Send a named message to a {@link NetworkEntity}.
 * @param {string} name Name of a message.
 * @param {object|array|string|number|boolean} [data] Optional message data.
 * Must be JSON friendly data.
 */
NetworkEntity.prototype.send = function(name, data) {
    for (const player of this.app.room.players) {
        player.user._send(name, data, 'networkEntity', this.id);
    }
};

NetworkEntity.prototype.onDestroy = function() {
    // TODO: remove when playcanvas application will be destroyed properly
    // https://github.com/playcanvas/engine/issues/4135
    this.player = null;
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

NetworkEntity.prototype._makePathParts = function(path) {
    let parts = this._pathParts[path];
    if (!parts) {
        parts = path.split('.');
        this._pathParts[path] = parts;
    }
    return parts;
};
