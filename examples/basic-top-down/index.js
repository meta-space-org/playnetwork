import express from 'express';
import * as http from 'http';

import pn from '../../src/server/index.js';
import FileLevelProvider from './file-level-provider.js';

const app = express();
const server = http.createServer(app);
server.listen(8080);

await pn.initialize({
    levelProvider: new FileLevelProvider('./examples/basic-top-down/levels'),
    scriptsPath: './examples/basic-top-down/components',
    templatesPath: './examples/basic-top-down/templates',
    server
});
