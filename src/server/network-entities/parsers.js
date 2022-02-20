import { roundTo } from '../utils.js';

export default new Map([
    [pc.Vec2, (data) => ({ x: roundTo(data.x), y: roundTo(data.y) })],
    [pc.Vec3, (data) => ({ x: roundTo(data.x), y: roundTo(data.y), z: roundTo(data.z) })],
    [pc.Vec4, (data) => ({ x: roundTo(data.x), y: roundTo(data.y), z: roundTo(data.z), w: roundTo(data.w) })],
    [pc.Quat, (data) => ({ x: roundTo(data.x), y: roundTo(data.y), z: roundTo(data.z), w: roundTo(data.w) })],
    [pc.Color, (data) => ({ r: data.r, g: data.g, b: data.b, a: data.a })],
    [Map, (data) => Array.from(data)],
    [Object, (data) => data]
]);
