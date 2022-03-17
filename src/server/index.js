import * as http from 'http';
import * as https from 'https';
import * as pc from 'playcanvas';
import WebSocket from 'faye-websocket';
import deflate from 'permessage-deflate';

import os from 'os';
import node from './../node/index.js';
import Node from './core/node.js';

import levels from './core/levels.js';
import Client from './core/client.js';

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
    async start(settings) {
        this._validateSettings(settings);

        levels.initialize(settings.levelProvider);

        settings.server.on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            let socket = new WebSocket(req, ws, body, [], { extensions: [deflate] });
            const client = new Client(socket);

            socket.on('open', () => {
                this.clients.set(client.id, client);
            });

            socket.on('message', async (e) => await this._onMessage(e.data, client));

            socket.on('close', (e) => {
                console.error('close', e.code, e.reason);
                client.destroy();
                socket = null;
            });
        });

        this.test = 0;

        this._createNodes(settings.nodePath, settings.scriptsPath, settings.templatesPath);

        console.log('PlayNetwork started');
        console.log(`Started ${os.cpus().length} nodes`);
    }

    _createNodes(nodePath, scriptsPath, templatesPath) {
        for (let i = 0; i < os.cpus().length; i++) {
            const node = new Node(i, nodePath, scriptsPath, templatesPath);
            this.nodes.set(i, node);
        }
    }

    async _onMessage(data, client) {
        const msg = JSON.parse(data);
        let node = null;

        if (msg.name === '_room:create') {
            node = [...client.nodes][0] || this.nodes.get(this.test % this.nodes.size);
            this.test++;
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

        node.channel.send('_message', { data: msg, clientId: client.id });
    }

    _validateSettings(settings) {
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

export {
    node
};
