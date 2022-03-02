import * as fs from 'fs/promises';

// TODO
// Create BaseLevelProvider class, with methods to override as part of library
// So it is extended by speicifc level providers and require methods implementations

class FileLevelProvider {
    constructor(path) {
        this.path = path;
    }

    async save(id, data) {
        await fs.mkdir(this.path, { recursive: true });
        await fs.writeFile(`${this.path}/${id}.json`, data);
    }

    async load(id) {
        try {
            return await fs.readFile(`${this.path}/${id}.json`);
        } catch (e) {
            console.error(e);
        }
    }
}

export default FileLevelProvider;
