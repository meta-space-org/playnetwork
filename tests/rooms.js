import { jest, describe, test, expect, beforeAll } from '@jest/globals';

import pn from './../src/server/index.js';
import serverLevels from './../src/server/libs/levels.js';

import { testLevel } from './utils/constants.js';

export const levels = () => {
    beforeAll(() => {
        global.client.levels._getEditorSceneData = jest.fn((sceneId, callback) => {
            callback(testLevel);
        });
    });

    describe('Levels', () => {
        test('Level saved', (done) => {
            global.client.levels.save(testLevel.scene, (err) => {
                try {
                    expect(err).toBeNull();
                    expect(serverLevels.provider.has(testLevel.scene)).toBeTruthy();
                } finally {
                    done();
                }
            });
        });
    });
};

export const rooms = () => {
    describe('Rooms', () => {
        // test('Client tried create room without data', (done) => {
        //     global.client.createRoom(null, (err, data) => {
        //         try {
        //             expect(err).toBeTruthy();
        //             expect(data).toBeNull();
        //         } finally {
        //             done();
        //         }
        //     });
        // });
    });
};
