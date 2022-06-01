import { Worker } from 'worker_threads';
import pc from 'playcanvas';

import pn from './../index.js';
import Channel from './channel.js';
import idProvider from './id-provider.js';

/**
 * @class WorkerNode
 * @classdesc Each {@link WorkerNode} is a worker, running in own process,
 * {@link PlayNetwork} creates multiple {@link WorkerNode}s to utilize all available
 * CPU threads of a server. And contains routing information for network messages, and
 * a channel for a communication to {@link Node} process.
 * @extends pc.EventHandler
 * @property {number} id Numerical identifier of a {@link WorkerNode}.
 */

/**
 * @event WorkerNode#error
 * @description Error that is fired by a {@link Node} process.
 * @param {Error} error
 */

export default class WorkerNode extends pc.EventHandler {
    constructor(id, nodePath, scriptsPath, templatesPath, useAmmo) {
        super();

        this.id = id;
        this._worker = new Worker(nodePath, { workerData: { scriptsPath, templatesPath, useAmmo } });
        this.channel = new Channel(this._worker, this);

        this.users = new Map();
        this.routes = {
            users: new Map(),
            rooms: new Map(),
            networkEntities: new Map()
        };

        this._worker.on('error', (err) => {
            console.error(err);
            this.fire('error', err);
        });

        this.on('_routes:add', (_, { type, id }) => {
            this.routes[type].set(id, this);
            pn.routes[type].set(id, this);
        });

        this.on('_routes:remove', (_, { type, id }) => {
            this.routes[type].delete(id);
            pn.routes[type].delete(id);
        });

        this.on('_message', (_, { userId, name, data, scope, msgId }) => {
            const user = this.users.get(userId);
            if (user) user.send(name, data, scope, msgId);
        });

        this.on('_id:generate', (_, type, callback) => {
            callback(null, idProvider.make(type));
        });
    }

    async send(name, data, userId, callback) {
        if (userId) {
            const user = pn.users.get(userId);
            if (!user.isConnectedToWorkerNode(this)) await user.connectToWorkerNode(this);
        }

        this.channel.send(name, data, userId, callback);
    }
}
