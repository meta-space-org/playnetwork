import os from 'os';
import * as http from 'http';
import * as https from 'https';
import * as pc from 'playcanvas';
import console from './libs/logger.js';
import WebSocket from 'faye-websocket';
import deflate from './libs/permessage-deflate/permessage-deflate.js';
import { downloadAsset, updateAssets } from './libs/assets.js';

import WorkerNode from './core/worker-node.js';
import User from './core/user.js';
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

        this.users = new Map();
        this.workerNodes = new Map();
        this.routes = {
            users: new Map(),
            rooms: new Map(),
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
            const user = new User(socket);

            socket.on('open', async () => {
                this.users.set(user.id, user);

                const node = this.workerNodes.get((user.id - 1) % this.workerNodes.size);
                await user.connectToWorkerNode(node);

                user.on('_room:create', (data, callback) => {
                    const node = [...user.workerNodes][0];
                    node.send('_room:create', data, user.id, callback);
                });

                user.on('_room:join', (id, callback) => {
                    const node = this.routes.rooms.get(id);
                    if (!node) callback(new Error('No such room'));

                    node.send('_room:join', id, user.id, callback);
                });

                user.on('_room:leave', (id, callback) => {
                    const node = this.routes.rooms.get(id);
                    if (!node) callback(new Error('No such room'));

                    node.send('_room:leave', id, user.id, callback);
                });

                user.on('_level:save', (data, callback) => {
                    const node = [...user.workerNodes][0];
                    node.send('_level:save', data, user.id, callback);
                });

                this.fire('connect', user);
            });

            socket.on('message', async (e) => {
                if (typeof e.data !== 'string') {
                    e.rawData = e.data.rawData;
                    e.data = e.data.data.toString('utf8', 0, e.data.data.length);
                } else {
                    e.rawData = e.data;
                }

                e.msg = JSON.parse(e.data);

                let callback = null;
                if (e.msg.id) callback = (err, data) => user.send(e.msg.name, err || data, null, e.msg.id);

                await this._onMessage(e.msg, user, callback);
            });

            socket.on('close', async () => {
                this.fire('disconnect', user);

                await user.destroy();
                this.users.delete(user.id);
                socket = null;
            });

            //performance.connectSocket(this, user, socket);
        });

        this._createWorkerNodes(settings.nodePath, settings.scriptsPath, settings.templatesPath, settings.useAmmo);

        //performance.addCpuLoad(this);
        //performance.addMemoryUsage(this);
        //performance.addBandwidth(this);

        console.info(`${os.cpus().length} WorkerNodes started`);
        console.info(`PlayNetwork started in ${Date.now() - startTime} ms`);
    }

    async downloadAsset(saveTo, id, token) {
        const start = Date.now();
        if (await downloadAsset(saveTo, id, token)) {
            console.info(`Asset downloaded ${id} in ${Date.now() - start} ms`);
        };
    }

    async updateAssets(directory, token) {
        const start = Date.now();
        if (await updateAssets(directory, token)) {
            console.info(`Assets updated in ${Date.now() - start} ms`);
        }
    }

    _createWorkerNodes(nodePath, scriptsPath, templatesPath, useAmmo) {
        for (let i = 0; i < os.cpus().length; i++) {
            const workerNode = new WorkerNode(i, nodePath, scriptsPath, templatesPath, useAmmo);
            this.workerNodes.set(i, workerNode);
            workerNode.on('error', (err) => this.fire('error', err));
        }
    }

    async _onMessage(msg, user, callback) {
        let workerNodes = [];

        switch (msg.scope.type) {
            case 'user':
                if (user.hasEvent(msg.name)) {
                    user.fire(msg.name, msg.data, callback);
                } else {
                    for (const workerNode of user.workerNodes) {
                        workerNodes.push(workerNode);
                    }
                }
                break;
            case 'room':
                workerNodes = [this.routes.rooms.get(msg.scope.id)];
                break;
            case 'networkEntity':
                workerNodes = [this.routes.networkEntities.get(msg.scope.id)];
                break;
        }

        if (!workerNodes.length) return;

        for (const workerNode of workerNodes) {
            workerNode.send('_message', msg, user.id, callback);
        }
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
