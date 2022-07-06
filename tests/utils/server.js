import pn from './../../src/server/index.js';
import { createServer as createHttpServer } from 'http';
import FileLevelProvider from '../mock/file-level-provider.js';

export const createServer = async (port) => {
    const server = createHttpServer();
    server.listen(port);

    await pn.start({
        scriptsPath: './tests/mock/components',
        templatesPath: './test/mock/templates',
        redisUrl: 'redis://default:redispw@localhost:49153',
        server: server,
        useAmmo: false,
        levelProvider: new FileLevelProvider('tests/mock/levels')
    });
};
