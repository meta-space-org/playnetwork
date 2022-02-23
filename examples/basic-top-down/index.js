import express from 'express';
import * as http from 'http';

import pn from '../../src/server/index.js';
import FileLevelProvider from './file-level-provider.js';

const app = express();
const server = http.createServer(app);
server.listen(8080);

pn.initialize({
    levelProvider: new FileLevelProvider('./levels'),
    scriptsPath: './components',
    templatesPath: './templates',
    server: server
});

pn.rooms.on('create', async (from, levelId, tickrate, payload, response) => {
    try {
        const room = await pn.rooms.create(levelId, tickrate, payload);
        room.join(from);
        response();
    } catch (ex) {
        response(ex);
    }
});

pn.rooms.on('join', (from, room, response) => {
    room.join(from);
    response();
});
