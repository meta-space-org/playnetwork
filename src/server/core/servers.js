import pn from './../index.js';
import Server from './server.js';

export default class Servers extends Map {
    async get(id, callback) {
        let server = super.get(id);
        if (!server) {
            const url = await pn.redis.HGET('_route:server', id.toString());
            if (!url) return null;

            server = new Server(id, url);
            this.set(id, server);
        }

        callback(server);
        return server;
    }
}
