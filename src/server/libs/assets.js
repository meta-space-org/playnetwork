import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { unifyPath } from './../../node/libs/utils.js';

async function _loadAssetById(id, token) {
    const options = {
        hostname: 'playcanvas.com',
        path: `/api/assets/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return new Promise((resolve) => {
        https.get(options, (response) => {
            let result = '';

            response.on('data', function(chunk) {
                result += chunk;
            });

            response.on('end', function() {
                resolve(result);
            });
        });
    });
};

export async function downloadAsset(saveTo, id, token) {
    const asset = await _loadAssetById(id, token);
    await fs.mkdir(path.dirname(saveTo), { recursive: true });
    await fs.writeFile(saveTo, asset);
};

export async function updateAssets(directory, token) {
    directory = unifyPath(directory);

    const files = await fs.readdir(directory);

    for (let i = 0; i < files.length; i++) {
        const _path = `${directory}${path.sep}${files[i]}`;
        const stats = await fs.stat(_path);

        if (stats.isDirectory()) {
            await updateAssets(_path, token);
        } else if (stats.isFile()) {
            const asset = JSON.parse(await fs.readFile(_path));
            await downloadAsset(_path, asset.id, token);
        }
    }
};
