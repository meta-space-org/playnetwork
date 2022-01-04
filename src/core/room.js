import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import NetworkEntities from './network-entities.js';
import levels from './levels.js';
import scripts from './scripts.js';
import templates from './templates.js';

export default class Room {
    constructor(id) {
        this.id = id;

        this.app = this.createApplication();
        this.app.room = this;

        this.level = null;
        this.users = new Map();
        this.networkEntities = new NetworkEntities(this.app);

        this.timeout = null;
        this.tick = 0;
        this.tickrate = 20; // UPS
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;

        console.log(`room ${this.id} created`);
    }

    async initialize(levelId) {
        for(let [ind, asset] of templates.index.entries()) {
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

        console.log(`room ${this.id} started`);
    }

    destroy() {
        if (! this.app)
            return;

        clearTimeout(this.timeout);
        this.timeout = null;

        this.app.destroy();
        this.app = null;

        this.level = null;
        this.users = null;
        this.networkEntities = null;

        console.log(`room ${this.id} destroyed`);
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

        this.app.scenes.loadSceneData(item, () => {});
        this.app.scenes.loadSceneHierarchy(item, () => {});
        this.app.scenes.loadSceneSettings(item, () => {});

        // make sure root has game script
        this.root = this.app.root.children[0];
        if (! this.root.script)
            this.root.addComponent('script');

        if (! this.root.script.game)
            this.root.script.create('game');
    }

    join(user) {
        if (! this.app)
            return;

        this.users.set(user.id, user);
        user.rooms.set(this.id, this);

        user.send('room:join', {
            roomId: this.id,
            tickrate: this.tickrate,
            level: this.toData()
        });

        // synchronise users of joined user
        for(const [ userId, otherUser ] of this.users) {
            // send all users to joined user
            user.send('users:add', {
                roomId: this.id,
                userId: otherUser.id
            });

            if (otherUser === user)
                continue;

            // send joined user to everyone else
            otherUser.send('users:add', {
                roomId: this.id,
                userId: user.id
            });
        }

        this.root.script.game.fire('join', user);
    }

    leave(user) {
        if (! this.app)
            return;

        user.rooms.delete(this.id);

        if (! this.users.has(user.id))
            return;

        this.users.delete(user.id);

        // tell user he has left
        user.send('room:left', {
            roomId: this.id
        });

        // tell everyone in the room about left user
        this.send('users:remove', {
            roomId: this.id,
            userId: user.id
        });

        this.root.script.game.fire('leave', user);

        // close room if no players left
        if (! this.users.size) {
            this.destroy();
        }
    }

    update() {
        if (! this.app)
            return;

        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;
        this.lastTickTime = this.currentTickTime;
        this.tick++;

        try {
            this.app.update(this.dt);
            this.send('state:update', this.networkEntities.getState());
        } catch (ex) {
            console.error(ex);
        }
    }

    send(name, data) {
        for(const [ userId, user ] of this.users) {
            user.send(name, data);
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
