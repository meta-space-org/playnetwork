import pn from '../index.js';

class Levels {
    cache = new Map();
    provider = null;

    initialize(provider) {
        this.provider = provider;

        pn.on('_level:save', (_, level, callback) => {
            try {
                this.save(level.scene, level);
                callback();
            } catch (ex) {
                callback(new Error('Unable to save level'));
                console.log('Unable to save level');
                console.error(ex);
            }
        });
    }

    // save level to cache and file
    save(id, level) {
        if (!Number.isInteger(id) || isNaN(id) || !isFinite(id))
            throw new Error('level id should be an integer');

        if (typeof (level) !== 'object')
            throw new Error('level should be an object');

        const data = JSON.stringify(level, null, 4);
        this.cache.set(id, data);
        this.provider.save(id, data);

        console.log(`level ${id}, saved`);
    }

    // load level from cache or file
    load(id) {
        if (this.cache.has(id)) {
            return JSON.parse(this.cache.get(id));
        } else {
            const data = this.provider.load(id);
            const level = data.toString();
            this.cache.set(id, level);
            return JSON.parse(level);
        }
    }
}

export default new Levels();
