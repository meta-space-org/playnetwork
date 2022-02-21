import * as http from 'http';
import * as utils from './utils.js';

class Server {
    constructor() {
        this.tickets = new Map();
        this.onAuth = utils.guid;
    }

    initialize(port) {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
        };

        return http.createServer((req, res) => {
            if (req.method === 'OPTIONS') {
                res.writeHead(204, headers);
                res.end();
                return;
            }

            if (req.method !== 'POST') {
                res.writeHead(405, headers);
                res.end(`${req.method} is not allowed for the request.`);
                return;
            }

            if (req.url !== '/auth') return;

            const body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                const payload = JSON.parse(Buffer.concat(body).toString());

                const ticket = this.onAuth(payload);

                if (!ticket) {
                    res.writeHead(401, headers);
                    res.end();
                    return;
                }

                this.tickets.set(ticket, payload);

                res.writeHead(200, headers);
                res.end(JSON.stringify({ ticket }));
            });
        }).listen(port);
    }
}

export default new Server();
