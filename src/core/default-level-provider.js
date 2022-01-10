import * as fs from 'fs/promises';

class DefaultLevelProvider {
    constructor(path) {
        this.path = path;
    }

    async save(id, data) {
        await fs.mkdir(this.path, { recursive: true });
        await fs.writeFile(`${this.path}/${id}.json`, data);
    }

    async load(id) {
        console.log('open');
        return await fs.readFile(`${this.path}/${id}.json`);
    }
}

export default DefaultLevelProvider;