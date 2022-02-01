import * as pc from 'playcanvas';
import Ammo from '../../src/libs/ammo/ammo.js';

import network from '../../src/core/network.js';
import scripts from '../../src/core/scripts.js';
import templates from '../../src/core/templates.js';

import DefaultLevelProvider from '../../src/core/levels/file-level-provider.js';

// make playcanvas namespace global
global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

// initialize ammo
global.Ammo = await new Ammo();
console.log('physics initialized');

// load scripts
await scripts.initialize('./examples/basic-top-down/components');
console.log('scripts initialized');

// load templates
await templates.initialize('./examples/basic-top-down/templates');
console.log('templates initialized');

// start network
await network.initialize(new DefaultLevelProvider('./examples/basic-top-down/levels'));
console.log('network initialized');

console.log('\nserver started');
