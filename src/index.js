import _Ammo from './libs/ammo/ammo.js';

import * as pc from 'playcanvas';
import overrideScriptRegistry from './libs/playcanvas-overwrite/create-script.js';

import WebGLRenderingContext from 'webgl-mock-threejs/src/WebGLRenderingContext.js';
import HTMLCanvasElement from 'webgl-mock-threejs/src/HTMLCanvasElement.js';

import Network from './core/network.js';
import AppHandler from './core/app-handler.js';

global.pc = {};
for(let key in pc) {
    global.pc[key] = pc[key];
}
overrideScriptRegistry();

new _Ammo().then(Ammo => {
    global.Ammo = Ammo;
    console.log('***AMMO INITIALIZED***');
});

WebGLRenderingContext.prototype['getSupportedExtensions'] = function() {
    return [];
};

HTMLCanvasElement.prototype['removeEventListener'] = function() { };

await AppHandler.initialize();

global.NETWORK = new Network();

console.log('***SERVER STARTED***');
