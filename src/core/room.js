import { EventHandler } from 'playcanvas';
import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import NetworkEntities from './network-entities/network-entities.js';
import levels from './levels/levels.js';
import scripts from './scripts.js';
import templates from './templates.js';

import Players from './players/players.js';
import Player from './players/player.js';

let lastRoomId = 1;

export default class Room extends EventHandler {
    constructor() {
        super();

        this.id = lastRoomId++;

        this.app = this.createApplication();
        this.app.room = this;

        this.level = null;
        this.players = new Players();
        this.networkEntities = new NetworkEntities(this.app, this.id);

        this.timeout = null;
        this.tick = 0;
        this.tickrate = 20; // UPS
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;

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
        this.loadScene();

        // start app
        this.app.start();

        // start update loop
        this.timeout = setInterval(() => {
            this.update();
        }, 1000 / this.tickrate);

        this.fire('initialize');

        console.log(`Room ${this.id} started`);
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

    createApplication() {
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

    loadScene() {
        const item = new pc.SceneRegistryItem(this.level.name, this.level.scene.toString());

        item.data = this.level;
        item._loading = false;

        this.app.scenes.loadSceneHierarchy(item, () => { });
        this.app.scenes.loadSceneSettings(item, () => { });

        this.root = this.app.root.children[0];
    }

    join(user) {
        if (!this.app || user.rooms.has(this.id)) return;

        const player = new Player(user, this);
        user.players.add(player);
        user.rooms.set(this.id, this);

        player.send('_room:join', {
            tickrate: this.tickrate,
            playerId: player.id,
            players: this.players.toData(),
            level: this.toData()
        });

        this.players.add(player);

        for (const [_, otherPlayer] of this.players) {
            // send joined user to everyone else
            otherPlayer.send('_player:join', { id: player.id, user: player.user.toData() });
        }

        this.fire('join', player);
    }

    leave(user) {
        if (!this.app || !user.rooms.has(this.id)) return;

        const player = this.players.getByUserId(user.id);
        if (!player) return;

        user.rooms.delete(this.id);
        player.send('_room:leave');
        player.destroy();
        this.players.send('_player:leave', player.id);

        player.fire('leave');
        this.fire('leave', player);

        if (!this.players.size) this.destroy();
    }

    update() {
        if (!this.app) return;

        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;
        this.lastTickTime = this.currentTickTime;
        this.tick++;

        try {
            this.app.update(this.dt);
            const state = this.networkEntities.getState();

            if (state.length) {
                this.players.send('_state:update', state);
            }
        } catch (ex) {
            console.error(ex);
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
}
