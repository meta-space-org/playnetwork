import * as pc from 'playcanvas';
import Ammo from './libs/ammo/ammo.js';

import network from './core/network.js';
import scripts from './core/scripts.js';
import templates from './core/templates.js';

// to run PlayCanvas without renderer, we need to mock the canvas
import WebGLRenderingContext from 'webgl-mock-threejs/src/WebGLRenderingContext.js';
import HTMLCanvasElement from 'webgl-mock-threejs/src/HTMLCanvasElement.js';
WebGLRenderingContext.prototype['getSupportedExtensions'] = function() { return []; };
HTMLCanvasElement.prototype['removeEventListener'] = function() { };

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
