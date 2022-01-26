import { roundTo } from "./utils.js";

const parsers = new Map([
    [pc.Vec2, (data) => ({ x: roundTo(data.x, 2), y: roundTo(data.y, 2) })],
    [pc.Vec3, (data) => ({ x: roundTo(data.x, 2), y: roundTo(data.y, 2), z: roundTo(data.z, 2)})],
    [pc.Vec4, (data) => ({ x: roundTo(data.x, 2), y: roundTo(data.y, 2), z: roundTo(data.z, 2), w: roundTo(data.w, 2) })],
    [pc.Quat, (data) => ({ x: roundTo(data.x, 2), y: roundTo(data.y, 2), z: roundTo(data.z, 2), w: roundTo(data.w, 2) })],
    [pc.Color, (data) => ({ r: data.r, g: data.g, b: data.b, a: data.a })],
    [Map, (data) => Array.from(data)],
    [Object, (data) => data]
]);

export default parsers;
