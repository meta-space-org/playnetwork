import * as pc from 'playcanvas';
import Ammo from './libs/ammo/ammo.js';

import network from './core/network.js';
import scripts from './core/scripts.js';
import templates from './core/templates.js';

// make playcanvas namespace global
global.pc = { };
for(let key in pc) {
    global.pc[key] = pc[key];
}

// initialize ammo
global.Ammo = await new Ammo();
console.log('physics initialized');

// load scripts
await scripts.initialize();
console.log('scripts initialized');

// load templates
await templates.initialize();
console.log('templates initialized');

// start network
await network.initialize();
console.log('network initialized');

console.log('\nserver started');
