import * as pc from 'playcanvas';
import pn from './../index.js';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import NetworkEntities from './network-entities/network-entities.js';

import scripts from './../libs/scripts.js';
import templates from './../libs/templates.js';
import levels from './../libs/levels.js';
import performance from '../libs/performance.js';

/**
 * @class Room
 * @classdesc A Room represents own PlayCanvas {@link pc.Application} context,
 * with a list of joined {@link User}s.
 * @extends pc.EventHandler
 * @property {number} id Unique ID of a {@link Room}.
 * @property {pc.Application} app PlayCanvas Application associated
 * with a {@link Room}.
 * @property {Set<User>} users List of all joined {@link User}s.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 */

/**
 * @event Room#initialize
 * @description Fired when {@link Room} has been loaded and initialized,
 * With PlayCanvas Application started.
 */

/**
 * @event Room#join
 * @description Fired when {@link User} has joined a {@link Room}.
 * @param {User} user
 */

/**
 * @event Room#leave
 * @description Fired when {@link User} has left a {@link Room}.
 * @param {User} user
 */

/**
 * @event Room#error
 * @description Fired when {@link pc.Application} throws an error. This is a
 * good place to handle gameplay errors.
 * @param {Error} error
 */

/**
 * @event Room#destroy
 * @description Fired when {@link Room} has been destroyed.
 */

export default class Room extends pc.EventHandler {
    constructor(id, tickrate = 20) {
        super();

        this.id = id;

        this.app = this._createApplication();
        this.app.room = this;
        this.root = null;

        this.level = null;
        this.users = new Map();
        this.networkEntities = new NetworkEntities(this.app, this.id);

        this.timeout = null;
        this.tick = 0;
        this.tickrate = tickrate;
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;

        performance.addBandwidth(this);
        performance.addRoomLatency(this);
    }

    async initialize(levelId) {
        await templates.addApplication(this.app);

        await this._loadLevel(levelId);

        return new Promise((resolve) => {
            this.networkEntities.on('ready', () => {
                this.app.start();

                this.timeout = setInterval(() => {
                    this._update();
                }, 1000 / this.tickrate);
                this.app.start();

                this.fire('initialize');
                resolve();
            });
        });
    }

    /**
     * @method send
     * @description Send named message to every {@link User} in this Room.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     * Must be JSON friendly data.
     */
    send(name, data) {
        for (const user of this.users.values()) {
            user._send(name, data, 'room', this.id);
        }
    }

    toData() {
        const data = {
            scene: this.level.scene.toString(),
            name: this.level.name,
            item_id: Math.random().toString(),
            settings: this.level.settings,
            entities: this.networkEntities.toData(this.root)
        };

        data.entities[this.root.getGuid()].parent = null;

        return data;
    }

    destroy() {
        if (!this.app) return;

        clearTimeout(this.timeout);
        this.timeout = null;

        this.app.destroy();
        // TODO: remove when playcanvas application will be destroyed properly
        // https://github.com/playcanvas/engine/issues/4135
        this.app.room = null;
        this.app = null;

        this.level = null;
        this.networkEntities = null;
        performance.removeBandwidth(this);
        performance.removeRoomLatency(this);

        pn.redis.HDEL('route:room', this.id.toString());

        this.fire('destroy');
        this.off();
    }

    _createApplication() {
        const canvas = new HTMLCanvasElement(100, 100);
        canvas.id = this.id;

        const app = new pc.Application(canvas);
        // disable render
        app.autoRender = false;
        // trigger libraries loaded
        app.onLibrariesLoaded();
        // update script registry to a global one
        app.scripts = scripts.registry;

        return app;
    }

    async _loadLevel(levelId) {
        this.level = await levels.load(levelId);

        const item = new pc.SceneRegistryItem(this.level.name, this.level.scene.toString());

        item.data = this.level;
        item._loading = false;

        return new Promise((resolve) => {
            this.app.scenes.loadSceneSettings(item, () => {
                this.app.scenes.loadSceneHierarchy(item, () => {
                    this.root = this.app.root.children[0];
                    resolve();
                });
            });
        });
    }

    _update() {
        if (!this.app) return;

        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;
        this.lastTickTime = this.currentTickTime;
        this.tick++;

        try {
            this.app.update(this.dt);
            const state = this.networkEntities.getState();

            if (state.length) {
                this.send('_state:update', state);
            }

            performance.handlePings(this);
        } catch (ex) {
            console.error(ex);
            this.fire('error', ex);
        }
    }
}
