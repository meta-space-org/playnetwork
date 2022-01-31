import templates from '../templates.js';

import User from './user.js';

export default class Users {
    lastUserId = 1;
    users = new Map();

    constructor() { }

    create(socket) {
        const user = new User(this.lastUserId++, socket);

        user.on('destroy', () => this.users.delete(user.id));

        return user;
    }

    add(user) {
        this.users.set(user.id, user);

        user.send('self', {
            userId: user.id,
            templates: templates.toData()
        });
    }

    send(name, data) {
        for (const [_, user] of this.users) {
            user.send(name, data);
        }
    }
}
