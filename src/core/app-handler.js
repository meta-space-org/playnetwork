import HTMLCanvasElement from 'webgl-mock-threejs/src/HTMLCanvasElement.js';
import fs from 'fs';

import NetworkEntity from './models/network-entity.js';
import path from 'path';
import vm from 'vm';

export default class AppHandler {
    static async initialize() {
        this.scripts = new pc.ScriptRegistry();
        const files = [];

        const collectComponents = (dir) => {
            fs.readdirSync(dir).forEach(f => {
                const absolute = path.join(dir, f);
                return fs.statSync(absolute).isDirectory()
                    ? collectComponents(absolute)
                    : files.push(absolute.replace('src\\game-example\\components\\', '').replace('\\', '/'));
            });
        }

        collectComponents('./src/game-example/components/');

        for (let file of files) {
            await import(`../game-example/components/${file}`);
        }

        fs.watch("./src/game-example/components", { recursive: true }, async (eventType, filename) => {
            if (eventType != 'change')
                return;

            const path = './src/game-example/components/' + filename.replace('\\', '/');
            const data = fs.readFileSync('./src/game-example/components/' + filename.replace('\\', '/'));
            try {
                vm.runInNewContext(data, global, path);
            } catch(e) {
                console.log(e)
            }
        });
    }

    static async createApp(levelId) {
        const canvas = new HTMLCanvasElement();
        canvas.id = Date.now();

        const app = new pc.Application(canvas);
        app.autoRender = false;
        app.onLibrariesLoaded();
        app.scripts = this.scripts;
    
        const { lastNetworkEntityId, networkEntities, level } = await this.loadLevel(app, levelId);

        return { lastNetworkEntityId, networkEntities, level, app };
    }

    static async loadLevel(app) {
        const level = NETWORK.savedLevel;
        const { lastNetworkEntityId, networkEntities } = this.initializeNetworkEntities(level);

        const sceneRegistryItem = new pc.SceneRegistryItem(level.name, level.scene);
        sceneRegistryItem.data = level;
        sceneRegistryItem._loading = false;

        app.scenes.loadSceneData(sceneRegistryItem, () => {});
        app.scenes.loadSceneHierarchy(sceneRegistryItem, () => {});
        app.scenes.loadSceneSettings(sceneRegistryItem, () => {});

        return { lastNetworkEntityId, networkEntities, level };
    }

    static initializeNetworkEntities(level) {
        let lastNetworkEntityId = 0;
        let networkEntities = new Map();

        for (let guid in level.entities) {
            const script = level.entities[guid].components.script;

            if (!script?.order.includes('networkEntity'))
                continue;

            const attributes = script.scripts.networkEntity.attributes;
            attributes.id = lastNetworkEntityId++;
            
            networkEntities.set(attributes.id, new NetworkEntity(attributes.id, attributes.syncInterval, level.entities[guid]));
        }

        return { lastNetworkEntityId, networkEntities };
    }
}
