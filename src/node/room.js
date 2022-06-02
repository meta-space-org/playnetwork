import * as pc from 'playcanvas';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import node from './index.js';

import NetworkEntities from './network-entities/network-entities.js';
import scripts from './libs/scripts.js';
import templates from './libs/templates.js';
import performance from './libs/node-performance.js';

import levels from './libs/levels.js';

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

        this.level = null;
        this.users = new Map();
        this.networkEntities = new NetworkEntities(this.app, this.id);

        this.timeout = null;
        this.tick = 0;
        this.tickrate = tickrate;
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;

        // performance.addBandwidth(this, 'room', this.id);

        node.send('_routes:add', { type: 'rooms', id: this.id });
    }

    async initialize(levelId) {
        await templates.addApplication(this.app);

        this.level = await levels.load(levelId);

        return new Promise((resolve) => {
            this.networkEntities.on('ready', () => {
                // start app
                this.app.start();

                // start update loop
                this.timeout = setInterval(() => {
                    this._update();
                }, 1000 / this.tickrate);

                this.fire('initialize');
                resolve();
            });

            this._loadScene();
        });
    }

    /**
     * @method join
     * @description Join a {@link User} to a {@link Room}. Upon joining,
     * @param {User} user
     */
    async join(user) {
        if (!this.app || user.rooms.has(this)) return;

        const usersData = {};
        for (const [id, user] of this.users) {
            usersData[id] = user.toData();
        }

        user.send('_room:join', {
            tickrate: this.tickrate,
            users: usersData,
            level: this.toData(),
            state: this.networkEntities.getState(true),
            id: this.id
        });

        this.users.set(user.id, user);
        user.rooms.add(this);

        // send data of a joined user to everyone
        this.send('_user:join', user.toData());

        this.fire('join', user);
    }

    /**
     * @method leave
     * @description Remove (leave) a {@link User} from a {@link Room}.
     * and remaining {@link Room} members will be notified.
     * @param {User} user
     */
    leave(user) {
        if (!this.app || !user.rooms.has(this)) return;

        this.users.delete(user.id);
        user.rooms.delete(this);
        this.send('_user:leave', user.id);
        user.send('_room:leave', this.id);

        user.fire('leave');
        this.fire('leave', user);
    }

    /**
     * @method send
     * @description Send named message to every {@link User} in this Room.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     * Must be JSON friendly data.
     */
    send(name, data) {
        for (const [_, user] of this.users) {
            user._send(name, data, 'room', this.id);
        }
    }

    /**
     * @method getNetworkEntityById
     * @description Get {@link NetworkEntity} of a {@link Room} by ID.
     * @param {number} id ID of a {@link NetworkEntity}.
     * @returns {NetworkEntity|null}
     */
    getNetworkEntityById(id) {
        return this.networkEntities.get(id);
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
        // performance.removeBandwidth(this);

        this.fire('destroy');
        this.off();

        node.send('_routes:remove', { type: 'rooms', id: this.id });
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

    _loadScene() {
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

            // performance.handlePings(this);
        } catch (ex) {
            console.error(ex);
            this.fire('error', ex);
        }
    }
}
