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
    constructor(id, nodePath, scriptsPath, templatesPath) {
        super();

        this.id = id;
        this._worker = new Worker(nodePath, { workerData: { scriptsPath, templatesPath } });
        this.channel = new Channel(this._worker);

        this.routes = {
            users: new Map(),
            rooms: new Map(),
            players: new Map(),
            networkEntities: new Map()
        };

        this._worker.on('error', (err) => {
            console.error(err);
            this.fire('error', err);
        });

        this.channel.on('_routes:add', ({ type, id }) => {
            this.routes[type].set(id, this);
            pn.routes[type].set(id, this);
        });

        this.channel.on('_routes:remove', ({ type, id }) => {
            this.routes[type].delete(id);
            pn.routes[type].delete(id);
        });

        this.channel.on('_user:message', ({ clientId, name, data, scope, msgId }) => {
            const client = pn.clients.get(clientId);
            if (client) client.send(name, data, scope, msgId);
        });

        this.channel.on('_id:generate', (type, callback) => {
            callback(null, idProvider.make(type));
        });
    }
}
