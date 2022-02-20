import network from '../network.js';

class Levels {
    cache = new Map();
    provider = null;

    initialize(provider) {
        this.provider = provider;

        network.on('_level:save', async (_, level, callback) => {
            try {
                await this.save(level.scene, level);
                callback();
            } catch (ex) {
                callback(new Error('Unable to save level'));
                console.log('Unable to save level');
                console.error(ex);
            }
        });

        console.log('levels initialized');
    }

    // save level to cache and file
    async save(id, level) {
        if (!Number.isInteger(id) || isNaN(id) || !isFinite(id))
            throw new Error('level id should be an integer');

        if (typeof (level) !== 'object')
            throw new Error('level should be an object');

        const data = JSON.stringify(level, null, 4);
        this.cache.set(id, data);
        await this.provider.save(id, data);

        console.log(`level ${id}, saved`);
    }

    // load level from cache or file
    async load(id) {
        if (this.cache.has(id)) {
            return JSON.parse(this.cache.get(id));
        } else {
            const data = await this.provider.load(id);
            const level = data.toString();
            this.cache.set(id, level);
            return JSON.parse(level);
        }
    }
}

export default new Levels();
