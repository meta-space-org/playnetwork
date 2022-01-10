import * as fs from 'fs/promises';

class Levels {
    cache = new Map();

    constructor() {}

    // save level to cache and file
    async save(id, level) {
        if (!Number.isInteger(id) || isNaN(id) || !isFinite(id))
            throw new Error('level id should be an integer');

        if (typeof(level) !== 'object')
            throw new Error('level should be an object');

        let data = JSON.stringify(level, null, 4);
        this.cache.set(id, data);
        LevelProvider.save(id, data);

        console.log(`level ${id}, saved`);
    }

    // load level from cache or file
    async load(id) {
        if (!Number.isInteger(id) || isNaN(id) || !isFinite(id))
            throw new Error('level id should be an integer');

        if (this.cache.has(id)) {
            return JSON.parse(this.cache.get(id));
        } else {
            const data = LevelProvider.load(id);
            const level = data.toString();
            this.cache.set(id, level);
            return JSON.parse(level);
        }
    }
}

export default new Levels();