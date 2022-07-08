import { describe } from '@jest/globals';

import { initialization, destruction } from './lifecycle.js';
import { clientMessages, serverMessages } from './messages.js';
import { levels, rooms } from './rooms.js';

initialization();

describe('Main tests', () => {
    clientMessages();
    serverMessages();
    levels();
    rooms();
});

destruction();
