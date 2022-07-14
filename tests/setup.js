import { HTMLCanvasElement } from '@playcanvas/canvas-mock/src/index.mjs';

import * as pc from 'playcanvas';
global.pc = pc;

const canvas = new HTMLCanvasElement(100, 100);
canvas.id = -1;
const app = new pc.Application(canvas);
app.autoRender = false;
app.start();
