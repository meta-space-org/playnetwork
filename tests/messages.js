import { describe, test, expect } from '@jest/globals';

import pn from './../src/server/index.js';

import { circularJson, testJson } from './utils/constants.js';

export const clientMessages = () => {
    describe('Client messages', () => {
        test('Client sent valid server message', (done) => {
            pn.once('test', (from, data) => {
                try {
                    expect(from.id).toBe(global.serverUser.id);
                    expect(data).toEqual(testJson);
                } finally {
                    done();
                }
            });

            global.client.send('test', testJson);
        });

        test('Client sent valid user message', (done) => {
            global.serverUser.once('test', (from, data) => {
                try {
                    expect(from.id).toBe(global.serverUser.id);
                    expect(data).toEqual(testJson);
                } finally {
                    done();
                }
            });

            global.client.me.send('test', testJson);
        });

        test('Client sent invalid server message', () => {
            expect(() => {
                global.client.send('test', circularJson);
            }).toThrow();
        });

        test('Client sent callback', (done) => {
            pn.once('test', (from, data, callback) => {
                expect(typeof callback).toBe('function');
                callback(null, data);
            });

            global.client.me.send('test', testJson, (err, data) => {
                try {
                    expect(err).toBeNull();
                    expect(data).toEqual(testJson);
                } finally {
                    done();
                }
            });
        });

        test('Server returned error', (done) => {
            pn.once('test', (from, data, callback) => {
                callback(new Error('test'));
            });

            global.client.me.send('test', testJson, (err, data) => {
                try {
                    expect(err).toEqual('test');
                    expect(data).toEqual({ err: 'test' });
                } finally {
                    done();
                }
            });
        });
    });
};

export const serverMessages = () => {
    describe('Server messages', () => {
        test('Server sent valid global message', (done) => {
            global.client.once('test', (data) => {
                try {
                    expect(data).toEqual(testJson);
                } finally {
                    done();
                }
            });

            global.serverUser.send('test', testJson);
        });

        test('Server sent valid user message', (done) => {
            global.client.me.once('test', (data) => {
                try {
                    expect(data).toEqual(testJson);
                } finally {
                    done();
                }
            });

            global.serverUser.send('test', testJson);
        });

        test('Server sent invalid global message', () => {
            expect(() => {
                global.serverUser.send('test', circularJson);
            }).toThrow();
        });
    });
};
