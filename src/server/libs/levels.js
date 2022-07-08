import pn from './../index.js'

class Levels {
    cache = new Map();
    provider = null;

    async initialize(provider) {
        this.provider = provider;

        pn.on('_level:save', async (sender, data, callback) => {
            await this.save(data.scene, data);
            callback();
        });
    }

    async save(id, level) {
        if (!Number.isInteger(id) || isNaN(id) || !isFinite(id)) throw new Error('level id should be an integer');
        if (typeof (level) !== 'object') throw new Error('level should be an object');

        const data = JSON.stringify(level, null, 4);
        this.cache.set(id, data);
        await this.provider.save(id, data);

        console.log(`level ${id}, saved`);
    }

    async load(id) {
        if (this.cache.has(id)) return JSON.parse(this.cache.get(id));

        const data = await this.provider.load(id);
        const level = data.toString();
        this.cache.set(id, level);
        return JSON.parse(level);
    }

    async has(id) {
        if (this.cache.has(id)) return true;
        return await this.provider.has(id);
    }
}

export default new Levels();
