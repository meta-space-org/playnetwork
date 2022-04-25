import os from 'os';
import * as http from 'http';
import * as https from 'https';
import * as pc from 'playcanvas';
import console from './libs/logger.js';
import WebSocket from 'faye-websocket';
import deflate from './libs/permessage-deflate/permessage-deflate.js';
import { downloadAsset, updateAssets } from './libs/assets.js';

import WorkerNode from './core/worker-node.js';
import Client from './core/client.js';
import performance from './libs/server-performance.js';

/**
 * @class PlayNetwork
 * @classdesc Main interface of PlayNetwork, which acts as a composer for
 * {@link WorkerNode}s. It handles socket connections, and then routes them to the
 * right {@link Node} based on message scope.
 * @extends pc.EventHandler
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {number} cpuLoad Current CPU load 0..1.
 * @property {number} memory Current memory usage in bytes.
 */

/**
 * @event PlayNetwork#error
 * @description Unhandled error, which relates to server start or crash of any
 * of the {@link WorkerNode}s.
 * @param {Error} error
 */

class PlayNetwork extends pc.EventHandler {
    constructor() {
        super();

        this.clients = new Map();
        this.workerNodes = new Map();
        this.routes = {
            users: new Map(),
            rooms: new Map(),
            players: new Map(),
            networkEntities: new Map()
        };
    }

    /**
     * @method start
     * @description Start PlayNetwork, by providing configuration parameters,
     * Level Provider (to save/load hierarchy data) and HTTP(s) server handle.
     * @async
     * @param {object} settings Object with settings for initialization.
     * @param {object} settings.nodePath Relative path to node file.
     * @param {string} settings.scriptsPath Relative path to script components.
     * @param {string} settings.templatesPath Relative path to templates.
     * @param {object} settings.server Instance of a http(s) server.
     */
    async start(settings) {
        const startTime = Date.now();

        this._validateSettings(settings);

        settings.server.on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            let socket = new WebSocket(req, ws, body, [], { extensions: [deflate] });
            const client = new Client(socket);

            socket.on('open', () => {
                this.clients.set(client.id, client);
            });

            socket.on('message', async (e) => {
                if (typeof e.data !== 'string') {
                    e.rawData = e.data.rawData;
                    e.data = e.data.data.toString('utf8', 0, e.data.data.length);
                } else {
                    e.rawData = e.data;
                }

                e.msg = JSON.parse(e.data);
                await this._onMessage(e.msg, client);
            });

            socket.on('close', async () => {
                await client.destroy();
                this.clients.delete(client.id);
                socket = null;
            });

            performance.connectSocket(this, client, socket);
        });

        this._createWorkerNodes(settings.nodePath, settings.scriptsPath, settings.templatesPath, settings.useAmmo);

        performance.addCpuLoad(this);
        performance.addMemoryUsage(this);
        performance.addBandwidth(this);

        console.info(`${os.cpus().length} WorkerNodes started`);
        console.info(`PlayNetwork started in ${Date.now() - startTime} ms`);
    }

    async downloadAsset(saveTo, id, token) {
        const start = Date.now();
        await downloadAsset(saveTo, id, token);
        console.info(`Downloaded asset ${id} in ${Date.now() - start} ms`);
    }

    async updateAssets(directory, token) {
        const start = Date.now();
        await updateAssets(directory, token);
        console.info(`Updated assets in ${Date.now() - start} ms`);
    }

    _createWorkerNodes(nodePath, scriptsPath, templatesPath, useAmmo) {
        for (let i = 0; i < os.cpus().length; i++) {
            const workerNode = new WorkerNode(i, nodePath, scriptsPath, templatesPath, useAmmo);
            this.workerNodes.set(i, workerNode);
            workerNode.on('error', (err) => this.fire('error', err));
        }
    }

    async _onMessage(msg, client) {
        if (this.hasEvent(msg.name)) {
            this.fire(msg.name, client, msg.data);
            return;
        }

        let workerNode = null;

        if (msg.name === '_room:join') {
            workerNode = this.routes.rooms.get(msg.data);
        } else if (msg.name === '_room:leave') {
            workerNode = this.routes.rooms.get(msg.data);
        } else {
            switch (msg.scope.type) {
                case 'user':
                    workerNode = [...client.workerNodes][0] || this.workerNodes.get((client.id - 1) % this.workerNodes.size);
                    break;
                case 'room':
                    workerNode = this.routes.rooms.get(msg.scope.id);
                    break;
                case 'player':
                    workerNode = this.routes.players.get(msg.scope.id);
                    break;
                case 'networkEntity':
                    workerNode = this.routes.networkEntities.get(msg.scope.id);
                    break;
            }
        }

        if (!workerNode) return;
        if (!client.isConnectedToWorkerNode(workerNode)) await client.connectToWorkerNode(workerNode);

        workerNode.channel.send('_message', { msg: msg, clientId: client.id });
    }

    _validateSettings(settings) {
        let error = '';

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
