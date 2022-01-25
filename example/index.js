import * as pc from 'playcanvas';
import Ammo from '../src/libs/ammo/ammo.js';

import network from '../src/core/network.js';
import scripts from '../src/core/scripts.js';
import templates from '../src/core/templates.js';

import DefaultLevelProvider from '../src/core/file-level-provider.js';

// make playcanvas namespace global
global.pc = { };
for(let key in pc) {
    global.pc[key] = pc[key];
}

// initialize ammo
global.Ammo = await new Ammo();
console.log('physics initialized');

// load scripts
await scripts.initialize('./example/components');
console.log('scripts initialized');

// load templates
await templates.initialize('./example/templates');
console.log('templates initialized');

// start network
await network.initialize(new DefaultLevelProvider('./example/levels'));
console.log('network initialized');

console.log('\nserver started');
