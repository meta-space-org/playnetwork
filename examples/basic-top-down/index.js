import network from '../../src/server/network.js';
import * as utils from '../../src/server/utils.js';
import DefaultLevelProvider from '../../src/server/levels/file-level-provider.js';

await network.initialize({
    levelProvider: new DefaultLevelProvider('./examples/basic-top-down/levels'),
    scriptsPath: './examples/basic-top-down/components',
    templatesPath: './examples/basic-top-down/templates',
    server: {
        onAuth: (payload) => {
            console.log(payload);
            return utils.guid();
        },
        port: 8080
    }
});
