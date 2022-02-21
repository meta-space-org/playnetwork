import network from '../../src/server/network.js';
import DefaultLevelProvider from '../../src/server/levels/file-level-provider.js';

await network.initialize({
    levelProvider: new DefaultLevelProvider('./examples/basic-top-down/levels'),
    scriptsPath: './examples/basic-top-down/components',
    templatesPath: './examples/basic-top-down/templates'
});

console.log('network initialized');
console.log('\nserver started');
