import * as http from 'http';
import * as https from 'https';
import * as pc from 'playcanvas';
import WebSocket from 'faye-websocket';
import deflate from 'permessage-deflate';

import os from 'os';
import { Worker } from 'worker_threads';

import levels from './libs/levels.js';
import idProvider from './core/id-provider.js';

import Client from './core/client.js';
import Channel from './core/channel.js';

/**
 * @class PlayNetwork
 * @classdesc Main interface of PlayNetwork
 * @extends pc.EventHandler
 */

class PlayNetwork extends pc.EventHandler {
    constructor() {
        super();

        this.clients = new Map();
        this.nodes = new Map();
        this.routes = {
            users: new Map(),
            rooms: new Map(),
            players: new Map(),
            networkEntities: new Map()
        };
    }

    /**
     * @method initialize
     * @description Initialize PlayNetwork, by providing configuration parameters,
     * Level Provider (to save/load hierarchy data) and HTTP(s) server handle.
     * @async
     * @param {object} settings Object with settings for initialization.
     * @param {object} settings.levelProvider Instance of level provider.
     * @param {string} settings.scriptsPath Relative path to script components.
     * @param {string} settings.templatesPath Relative path to templates.
     * @param {object} settings.server Instance of a http server.
     */
    async initialize(settings) {
        this._validateNetworkSettings(settings);

        levels.initialize(settings.levelProvider);

        settings.server.on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            let socket = new WebSocket(req, ws, body, [], { extensions: [deflate] });
            const client = socket.client = new Client(socket);

            socket.on('open', () => {
                this.clients.set(client.id, client);
            });

            socket.on('message', async (e) => await this._onMessage(e.data, client));

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                client.disconnect();
                socket = null;
            });
        });

        this._createNodes(settings.nodePath, settings.scriptsPath, settings.templatesPath);

        console.log('PlayNetwork initialized');
        console.log(`Started ${os.cpus().length} nodes`);
    }

    _createNodes(nodePath, scriptsPath, templatesPath) {
        for (let i = 0; i < os.cpus().length; i++) {
            const worker = new Worker(nodePath, { workerData: { scriptsPath, templatesPath } });
            const node = new Channel(worker);
            this.nodes.set(i, node);

            node.on('_routes:add', ({ type, id }) => {
                this.routes[type].set(id, node);
            });

            node.on('_routes:remove', ({ type, id }) => {
                this.routes[type].delete(id);
            });

            node.on('_level:load', async (levelId, callback) => {
                callback(null, await levels.load(levelId));
            });

            node.on('_user:message', ({ clientId, data }) => {
                const client = this.clients.get(clientId);
                if (client) client.send(data);
            });

            node.on('_id:generate', (type, callback) => {
                callback(null, idProvider.generateId(type));
            });
        }
    }

    async _onMessage(data, client) {
        const msg = JSON.parse(data);
        let node = null;

        if (msg.name === '_room:create') {
            node = client.nodes.get(client.id % this.nodes.size) || this.nodes.get(client.id % this.nodes.size);
        } else if (msg.name === '_room:join') {
            node = this.routes.rooms.get(msg.data);
        } else if (msg.name === '_room:leave') {
            node = this.routes.rooms.get(msg.data);
        } else {
            switch (msg.scope.type) {
                case 'room':
                    node = this.routes.rooms.get(msg.scope.id);
                    break;
                case 'player':
                    node = this.routes.players.get(msg.scope.id);
                    break;
                case 'networkEntity':
                    node = this.routes.networkEntities.get(msg.scope.id);
                    break;
            }
        }

        if (!node) return;
        if (!client.isConnectedToNode(node)) await client.connectToNode(node);

        node.send('_message', { data: msg, clientId: client.id });
    }

    _validateNetworkSettings(settings) {
        let error = '';

        if (!settings.levelProvider)
            error += 'settings.levelProvider is required\n';

        if (!settings.scriptsPath)
            error += 'settings.scriptsPath is required\n';

        if (!settings.templatesPath)
            error += 'settings.templatesPath is required\n';

        if (!settings.server || (!(settings.server instanceof http.Server) && !(settings.server instanceof https.Server)))
            error += 'settings.server is required\n';

        if (!settings.nodePath)
            error += 'settings.nodePath is required\n';

        if (error) throw new Error(error);
    }
}

export default new PlayNetwork();
