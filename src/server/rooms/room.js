import { EventHandler } from 'playcanvas';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import network from '../index.js';

import NetworkEntities from '../network-entities/network-entities.js';
import levels from '../levels.js';
import scripts from '../scripts.js';
import templates from '../templates.js';

import Players from '../players/players.js';
import Player from '../players/player.js';

/**
 * Room
 * @name Room
 * @property {number} id
 * @property {pc.Application} pc.Application
 * @property {Players} players
 * @property {*} payload
 */

/**
 * @event Room#join
 * @type {object}
 * @description TODO
 * @property {Player} player
 */

/**
 * @event Room#leave
 * @type {object}
 * @description TODO
 * @property {Player} player
 */

/**
 * @event Room#destroy
 * @type {object}
 * @description TODO
 */
export default class Room extends EventHandler {
    static _lastId = 1;

    constructor(tickrate = 20, payload) {
        super();

        this.id = Room._lastId++;

        this.app = this._createApplication();
        this.app.room = this;

        this.level = null;
        this.players = new Players();
        this.networkEntities = new NetworkEntities(this.app, this.id);

        this.timeout = null;
        this.tick = 0;
        this.tickrate = tickrate;
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;

        this.payload = payload;

        console.log(`Room ${this.id} created`);
    }

    async initialize(levelId) {
        for (const [_, asset] of templates.index.entries()) {
            this.app.assets.add(asset);
            this.app.assets.load(asset);
        }

        // load level
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
     * TODO
     * @param {User} user
     */
    join(user) {
        if (!this.app || user.rooms.has(this.id)) return;

        const player = new Player(user, this);
        user.players.add(player);
        user.rooms.set(this.id, this);

        player.send('_room:join', {
            tickrate: this.tickrate,
            payload: this.payload,
            playerId: player.id,
            players: this.players.toData(),
            level: this.toData(),
            state: this.networkEntities.getState(true),
            roomId: this.id
        });

        network.players.add(player);
        this.players.add(player);

        // send joined user to everyone
        this.send('_player:join', { id: player.id, userData: player.user.toData() });

        this.fire('join', player);
    }

    /**
     * TODO
     * @param {User} user
     */
    leave(user) {
        if (!this.app || !user.rooms.has(this.id)) return;

        const player = this.players.getByUserId(user.id);
        if (!player) return;

        user.rooms.delete(this.id);
        player.send('_room:leave', this.id);
        player.destroy();
        this.send('_player:leave', player.id);

        player.fire('leave');
        this.fire('leave', player);
    }

    /**
     * TODO
     * @param {string} name
     * @param {*} data
     */
    send(name, data) {
        for (const [_, player] of this.players) {
            player.user._send(name, data, 'room', this.id);
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
        this.app = null;

        this.level = null;
        this.players = null;
        this.networkEntities = null;

        this.fire('destroy');
        this.off();

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
        }
    }
}
