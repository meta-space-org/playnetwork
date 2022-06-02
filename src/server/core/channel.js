import * as pc from 'playcanvas';

export default class Channel extends pc.EventHandler {
    constructor(port, eventHandler) {
        super();

        this.msgId = 1;
        this.callbacks = new Map();
        this.port = port;
        this.eventHandler = eventHandler;

        this.port.on('message', (msg) => {
            const waitedCallback = this.callbacks.get(msg.callbackId);
            if (waitedCallback) {
                waitedCallback(msg.err, msg.data);
                this.callbacks.delete(msg.callbackId);
                return;
            }

            const user = this.eventHandler.users.get(msg.userId);

            let callback = null;
            if (msg.msgId) callback = (err, data) => this.port.postMessage({ name: msg.name, err, data, callbackId: msg.msgId });

            this.eventHandler.fire(msg.name, user, msg.data, callback);
        });
    }

    send(name, data, userId, callback) {
        this.port.postMessage({ name, data, userId, msgId: callback ? this.msgId : null });
        if (!callback) return;

        this.callbacks.set(this.msgId, callback);
        this.msgId++;
    }
}
