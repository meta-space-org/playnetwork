import { Worker } from 'worker_threads';
import pc from 'playcanvas';

import pn from './../index.js';
import Channel from './channel.js';
import idProvider from './id-provider.js';

export default class Node extends pc.EventHandler {
    constructor(id, nodePath, scriptsPath, templatesPath) {
        super();

        this.id = id;
        this.worker = new Worker(nodePath, { workerData: { scriptsPath, templatesPath } });
        this.channel = new Channel(this.worker);
        this.routes = {
            users: new Map(),
            rooms: new Map(),
            players: new Map(),
            networkEntities: new Map()
        };

        this.worker.on('error', (e) => {
            console.error(e);
            this.fire('error', e);
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
