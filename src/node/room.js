import * as pc from 'playcanvas';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import node from './index.js';

import NetworkEntities from './network-entities/network-entities.js';
import scripts from './libs/scripts.js';
import templates from './libs/templates.js';
// import performance from './libs/performance.js';

import Player from './player.js';
import levels from './libs/levels.js';

/**
 * @class Room
 * @classdesc A Room represents own PlayCanvas {@link pc.Application} context,
 * with a list of joined {@link Player}s.
 * @extends pc.EventHandler
 * @property {number} id Unique ID of a {@link Room}.
 * @property {pc.Application} app PlayCanvas Application associated
 * with a {@link Room}.
 * @property {Set<Player>} players List of all joined {@link Player}s.
 * Each {@link User} has one {@link Player} which lifetime is associated
 * with this {@link Room}.
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
 * @description Fired when {@link Player} has joined a {@link Room}.
 * @property {Player} player
 */

/**
 * @event Room#leave
 * @description Fired when {@link Player} has left a {@link Room}.
 * @property {Player} player
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
        this.players = new Set();
        this.playersById = new Map();
        this.playersByUser = new Map();
        this.networkEntities = new NetworkEntities(this.app, this.id);

        this.timeout = null;
        this.tick = 0;
        this.tickrate = tickrate;
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;

        // performance.addBandwidth(this, 'room', this.id);

        console.log(`Room ${this.id} created`);

        node.channel.send('_routes:add', { type: 'rooms', id: this.id });
    }

    async initialize(levelId) {
        await templates.addApplication(this.app);

        this.level = await levels.load(levelId);

        // create scene from level
        this._loadScene();

        // start app
        this.app.start();

        // start update loop
        this.timeout = setInterval(() => {
            this._update();
        }, 1000 / this.tickrate);

        this.fire('initialize');

        console.log(`Room ${this.id} started`);
    }

    /**
     * @method join
     * @description Join a {@link User} to a {@link Room}. Upon joining,
     * new {@link Player} instance will be created for this specific {@link Room}.
     * @param {User} user
     */
    async join(user) {
        if (!this.app || user.rooms.has(this)) return;

        const playerId = await node.generateId('player');
        const player = new Player(playerId, user, this);

        node.addPlayer(player);
        user.addPlayer(player);

        const playersData = {};
        for (const player of this.players) {
            playersData[player.id] = player.toData();
        }

        user.send('_room:join', {
            tickrate: this.tickrate,
            players: playersData,
            level: this.toData(),
            state: this.networkEntities.getState(true),
            roomId: this.id
        });

        // indices
        this.players.add(player);
        this.playersById.set(player.id, player);
        this.playersByUser.set(user, player);

        player.once('destroy', () => {
            this.players.delete(player);
            this.playersById.delete(player.id);
            this.playersByUser.delete(user);
        });

        // send data of a joined user to everyone
        this.send('_player:join', {
            id: player.id,
            userData: player.user.toData()
        });

        this.fire('join', player);
    }

    /**
     * @method leave
     * @description Remove (leave) a {@link User} from a {@link Room}.
     * Related {@link Player} instances will be destroyed
     * and remaining {@link Room} members will be notified.
     * @param {User} user
     */
    leave(user) {
        if (!this.app || !user.rooms.has(this)) return;

        const player = this.playersByUser.get(user);
        if (!player) return;

        player.send('_room:leave', this.id);
        player.destroy();
        this.send('_player:leave', player.id);

        player.fire('leave');
        this.fire('leave', player);
    }

    /**
     * @method send
     * @description Send named message to every {@link Player} in a {@link Room}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     * Must be JSON friendly data.
     */
    send(name, data) {
        for (const player of this.players) {
            player.user._send(name, data, 'room', this.id);
        }
    }

    /**
     * @method getPlayerById
     * @description Get {@link Player} of a {@link Room} by ID.
     * @param {number} id ID of a {@link Player}.
     * @returns {Player|null} Player related to a specific {@link User}
     * and this {@link Room}
     */
    getPlayerById(id) {
        return this.playersById.get(id) || null;
    }

    /**
     * @method getPlayerByUser
     * @description Get {@link Player} of a {@link Room} by {@link User}.
     * @param {User} user {@link User} which is a member of this {@link Room}.
     * @returns {Player|null} Player related to a specific {@link User}
     * and this {@link Room}
     */
    getPlayerByUser(user) {
        return this.playersByUser.get(user) || null;
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
        this.players = null;
        this.networkEntities = null;
        // performance.removeBandwidth(this);

        this.fire('destroy');
        this.off();

        node.channel.send('_routes:remove', { type: 'rooms', id: this.id });

        console.log(`Room ${this.id} destroyed`);
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

        this.app.scenes.loadSceneHierarchy(item, () => { });
        this.app.scenes.loadSceneSettings(item, () => { });

        this.root = this.app.root.children[0];
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
        } catch (ex) {
            console.error(ex);
            this.fire('error', ex);
        }
    }
}
