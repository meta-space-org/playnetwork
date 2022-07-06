import pn from './../src/server/index.js';

import { createServer } from './utils/server.js';
import { createClient, connectClient } from './utils/client.js';

let client = null;
let serverUser = null;

test('Server created', async () => {
    await createServer(8080);
    expect(pn.id).toEqual(expect.anything());
});

test('Client initialized', (done) => {
    createClient((c) => {
        client = c;
        try {
            expect(client).toBeDefined();
            expect(client.levels).toBeDefined();
            expect(client.networkEntities).toBeDefined();
        } finally {
            done();
        }
    });
});

test('Client connected', (done) => {
    connectClient(client, 8080, (err, user) => {
        try {
            serverUser = user;
            expect(err).toBeNull();
            expect(user).toEqual(expect.anything());
            expect(pn.users._index.has(user.id)).toBeTruthy();
            expect(client.me).toEqual(expect.anything());
        } finally {
            done();
        }
    });
});

test('Client sent valid message', (done) => {
    console.log(4);
    const testData = { test: 'test' };

    pn.once('test', (from, data) => {
        try {
            expect(from.id).toBe(serverUser.id);
            expect(data).toEqual(testData);
        } finally {
            done();
        }
    });

    client.send('test', testData);
});

test('Client disconnect', (done) => {
    console.log(5);
    // TODO: subscribe on pn
    pn.users.once('disconnect', (user) => {
        try {
            expect(user.id).toBe(serverUser.id);
            expect(pn.users._index.has(user.id)).toBeFalsy();
        } finally {
            done();
        }
    });

    client.socket.close();
});

// test('Server send message', (done) => {
//     const testData = { test: 'test' };

//     serverUser.send('test', testData);

//     // pn.once('test', (from, data) => {
//     //     try {
//     //         expect(from).toBe(serverUser);
//     //         expect(data).toEqual(testData);
//     //     } finally {
//     //         done();
//     //     }
//     // });

//     // client1.send('test', testData);
// });
