import * as fs from 'fs/promises';

class FileLevelProvider {
    constructor(path) {
        this.path = path;
    }

    async save(id, data) {
        await fs.mkdir(this.path, { recursive: true });
        await fs.writeFile(`${this.path}/${id}.json`, data);
    }

    async load(id) {
        return await fs.readFile(`${this.path}/${id}.json`);
    }

    has(id) {
        return fs.existsSync(`${this.path}/${id}.json`);
    }
}

export default FileLevelProvider;
