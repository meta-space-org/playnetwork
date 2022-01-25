const parsers = new Map([
    [pc.Vec2, (data) => ({ x: data.x, y: data.y })],
    [pc.Vec3, (data) => ({ x: data.x, y: data.y, z: data.z })],
    [pc.Vec4, (data) => ({ x: data.x, y: data.y, z: data.z, w: data.w })],
    [pc.Quat, (data) => ({ x: data.x, y: data.y, z: data.z, w: data.w })],
    [pc.Color, (data) => ({ r: data.r, g: data.g, b: data.b, a: data.a })],
    [Map, (data) => Array.from(data)],
    [Object, (data) => data]
]);

export default parsers;
