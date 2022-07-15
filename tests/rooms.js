import { jest, describe, test, expect, beforeAll } from '@jest/globals';

import pn from './../src/server/index.js';
import serverLevels from './../src/server/libs/levels.js';

import { testJson, testLevel } from './utils/constants.js';

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
        test('Client tried create room without data', (done) => {
            global.client.createRoom(null, (err) => {
                try {
                    expect(err).toBeTruthy();
                    expect(err.message).toBe('No levelId provided');
                } finally {
                    done();
                }
            });
        });

        test('Client tried create room with invalid levelId', (done) => {
            global.client.createRoom({ levelId: 'invalid' }, (err) => {
                try {
                    expect(err).toBeTruthy();
                    expect(err.message).toBe('Level not found');
                } finally {
                    done();
                }
            });
        });

        test('Client tried joining room without id', (done) => {
            global.client.joinRoom(null, (err) => {
                try {
                    expect(err).toBeTruthy();
                    expect(err.message).toBe('Room id is required');
                } finally {
                    done();
                }
            });
        });

        test('Client tried joining room with invalid id', (done) => {
            global.client.joinRoom('invalid', (err) => {
                try {
                    expect(err).toBeTruthy();
                    expect(err.message).toBe('Room not found');
                } finally {
                    done();
                }
            });
        });

        let createdRoomId = null;

        test('Client created room', (done) => {
            global.client.createRoom({ levelId: testLevel.scene }, (err, roomId) => {
                try {
                    createdRoomId = roomId;
                    expect(err).toBeNull();
                    expect(roomId).toBeTruthy();
                    expect(pn.rooms.has(roomId));
                } finally {
                    done();
                }
            });
        });

        let createdRoom = null;

        test('Client joined room', (done) => {
            pn.rooms.once('join', (room, user) => {
                createdRoom = room;

                expect(room).toBeTruthy();
                expect(user).toBeTruthy();
                expect(room.id).toBe(createdRoomId);
                expect(user.id).toBe(global.client.me.id);
                expect(room.users.has(global.client.me.id)).toBeTruthy();
                expect(user.room === room).toBeTruthy();
            });

            global.client.once('join', (room) => {
                try {
                    expect(room).toBeTruthy();
                    expect(global.client.room).toBeTruthy();
                    expect(room.id).toBe(createdRoomId);
                    expect(room.users.has(global.client.me.id)).toBeTruthy();
                } finally {
                    done();
                }
            });

            global.client.joinRoom(createdRoomId, (err) => {
                expect(err).toBeNull();
            });
        });

        test('Client sent message to room', (done) => {
            createdRoom.once('test', (from, data, callback) => {
                try {
                    expect(from.id).toBe(global.serverUser.id);
                    expect(data).toEqual(testJson);
                } finally {
                    callback(null, data);
                }
            });

            global.client.room.send('test', testJson, (err, data) => {
                try {
                    expect(err).toBeNull();
                    expect(data).toEqual(testJson);
                } finally {
                    done();
                }
            });
        });

        test('Client left room', (done) => {
            global.client.once('leave', (room) => {
                try {
                    expect(room).toBeTruthy();
                    expect(room.id).toBe(createdRoomId);
                    expect(global.client.room).toBeNull();
                } finally {
                    done();
                }
            });

            global.client.leaveRoom((err) => {
                expect(err).toBeNull();
            });
        });

        test('Client left unexisting room', (done) => {
            global.client.leaveRoom((err) => {
                try {
                    expect(err).toBeTruthy();
                    expect(err.message).toBe('Not in a Room');
                } finally {
                    done();
                }
            });
        });
    });
};
