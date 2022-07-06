import { jest } from '@jest/globals';

export const createClient = (callback) => {
    jest.isolateModules(async () => {
        await import('./../../dist/pn.js');
        callback(window.pn);
    });
};

export const connectClient = (client, port, callback) => {
    const host = 'localhost';
    const useSSL = false;
    const payload = null;
    client.connect(host, port, useSSL, payload, callback);
};
