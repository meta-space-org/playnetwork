import { describe, test, expect } from '@jest/globals';

import pn from '../src/server/index.js';

import { createServer } from './utils/server.js';
import { createClient, connectClient } from './utils/client.js';

export const initialization = () => {
    describe('Initialization', () => {
        test('Server create failed', async () => {
            await expect(pn.start()).rejects.toThrow();
        });

        test('Server created', async () => {
            await createServer(8080);
            expect(pn.id).toEqual(expect.anything());
        });

        test('Client initialized', (done) => {
            createClient((client) => {
                try {
                    expect(client).toBeDefined();
                    expect(client.levels).toBeDefined();
                    global.client = client;
                } finally {
                    done();
                }
            });
        });

        test('Client connected', (done) => {
            connectClient(global.client, 8080, (err, user) => {
                try {
                    expect(err).toBeNull();
                    expect(user).toEqual(expect.anything());
                    expect(pn.users._index.has(user.id)).toBeTruthy();
                    expect(global.client.me).toEqual(expect.anything());
                    expect(global.client.me.mine).toBeTruthy();
                    global.serverUser = pn.users._index.get(user.id);
                } finally {
                    done();
                }
            });
        });
    });
};

export const destruction = () => {
    describe('Destruction', () => {
        test('Client disconnect', (done) => {
            pn.users.once('disconnect', (user) => {
                try {
                    expect(user.id).toBe(global.serverUser.id);
                    expect(pn.users._index.has(user.id)).toBeFalsy();
                } finally {
                    done();
                }
            });

            global.client.socket.close();
        });
    });
};
