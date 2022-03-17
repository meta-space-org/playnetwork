import { Worker } from 'worker_threads';

import pn from './../index.js';
import Channel from './channel.js';
import levels from './levels.js';
import idProvider from './id-provider.js';

export default class Node {
    constructor(id, nodePath, scriptsPath, templatesPath) {
        this.id = id;
        this.worker = new Worker(nodePath, { workerData: { scriptsPath, templatesPath } });
        this.channel = new Channel(this.worker);

        // TODO: add indexes per node

        this.channel.on('_routes:add', ({ type, id }) => {
            pn.routes[type].set(id, this);
        });

        this.channel.on('_routes:remove', ({ type, id }) => {
            pn.routes[type].delete(id);
        });

        this.channel.on('_level:load', async (levelId, callback) => {
            callback(null, await levels.load(levelId));
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
