import * as pc from 'playcanvas';

export default class Channel extends pc.EventHandler {
    constructor(port) {
        super();

        this.msgId = 1;
        this.callbacks = new Map();
        this.port = port;

        this.port.on('message', (msg) => {
            const callback = this.callbacks.get(msg.callbackId);
            if (callback) {
                callback(msg.data);
                this.callbacks.delete(msg.callbackId);
                return;
            }

            if (msg.msgId) {
                this.fire(msg.name, msg.data, (err, data) => {
                    if (err) return;
                    this.port.postMessage({ name: msg.name, data: data, callbackId: msg.msgId });
                });
            } else {
                this.fire(msg.name, msg.data);
            }
        });
    }

    send(name, data, callback) {
        this.port.postMessage({ name, data, msgId: callback ? this.msgId : null });
        if (!callback) return;

        this.callbacks.set(this.msgId, callback);
        this.msgId++;
    }
}
