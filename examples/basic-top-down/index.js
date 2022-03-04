import express from 'express';
import * as http from 'http';

import pn from '../../src/server/index.js';
import FileLevelProvider from './file-level-provider.js';

const app = express();
const server = http.createServer(app);
server.listen(8080);

await pn.initialize({
    levelProvider: new FileLevelProvider('./levels'),
    scriptsPath: './components',
    templatesPath: './templates',
    server: server,
    clientPort: 8081
});

pn.rooms.on('create', async (from, data) => {
    const room = await pn.rooms.create(data.levelId, data.tickrate);
    room.join(from);
});

pn.rooms.on('join', async (from, room) => {
    room.join(from);
});
