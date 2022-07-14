import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { unifyPath } from './utils.js';

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
            if (response.statusCode !== 200) {
                resolve(null);
                return;
            }

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
    if (!token) {
        console.error('No playcanvas token provided');
        return false;
    }

    const asset = await _loadAssetById(id, token);
    if (!asset) return;

    await fs.mkdir(path.dirname(saveTo), { recursive: true });
    await fs.writeFile(saveTo, asset);

    return true;
};

export async function updateAssets(directory, token) {
    if (!token) {
        console.error('No playcanvas token provided');
        return false;
    }

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

    return true;
};
