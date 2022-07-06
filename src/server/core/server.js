import * as pc from 'playcanvas';
import pn from './../index.js';

export default class Server extends pc.EventHandler {
    constructor(id) {
        super();

        this.id = id;
        this.msgId = 1;
        this.callbacks = new Map();

        pn.redisSubscriber.SUBSCRIBE(`message:${this.id}`, async (msg) => {
            msg = JSON.parse(msg);
            const waitedCallback = this.callbacks.get(msg.callbackId);
            if (waitedCallback) {
                waitedCallback(msg.err, msg.data);
                this.callbacks.delete(msg.callbackId);
                return;
            }

            const user = await pn.users.get(msg.userId);
            let callback = null;
            if (msg.msgId) callback = (err, data) => pn.redis.PUBLISH(`message:${msg.serverId}`, JSON.stringify({ name: msg.name, err, data, callbackId: msg.msgId }));
            this.fire(msg.name, user, msg.data, callback);
        });

        this.on('_message', (user, data, callback) => {
            pn._onMessage(data, user, (err, data) => {
                if (callback) callback(err, data);
            });
        });

        this.on('_fire', async (user, data, callback) => {
            let target = null;

            switch (data.type) {
                case 'user':
                    target = await pn.users.get(data.id);
                    break;
                case 'room':
                    target = await pn.rooms.get(data.id);
                    break;
                case 'networkEntity':
                    target = await pn.networkEntities.get(data.id);
                    break;
            }

            target?.fire(data.data.name, user, data.data.data, callback);
        });

        this.on('_send', (user, data) => {
            user._send(data.name, data.data, data.scope.type, data.scope.id);
        });
    }

    send(name, data, serverId, userId, callback) {
        pn.redis.PUBLISH(`message:${serverId}`, JSON.stringify({ name, data, userId, msgId: callback ? this.msgId : null, serverId: this.id }));
        if (!callback) return;

        this.callbacks.set(this.msgId, callback);
        this.msgId++;
    }
}
