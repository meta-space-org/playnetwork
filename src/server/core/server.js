import * as pc from 'playcanvas';
import WebSocket from 'faye-websocket';

export default class Server extends pc.EventHandler {
    constructor(id, url) {
        super();

        this.id = id;
        this.url = url;

        this._socket = new WebSocket.Client(`ws://${this.url}`, [], {
            headers: { 'User-Agent': 'PlayNetwork' }
        });

        this._msgId = 1;
        this._callbacks = new Map();

        this.on('_send', (user, data) => {
            user._send(data.name, data.data, data.scope.type, data.scope.id);
        });
    }

    send(name, data, scope, id, userId, callback) {
        const msg = {
            name,
            data,
            scope: {
                type: scope,
                id
            },
            userId
        };

        if (callback) {
            msg.id = this._msgId++;
            this._callbacks.set(msg.id, callback);
        }

        this._socket.send(JSON.stringify(msg));
    }
}
