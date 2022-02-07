import templates from '../templates.js';

export default class Users {
    users = new Map();

    add(user) {
        this.users.set(user.id, user);

        user.send('_self', {
            user: user.toData(),
            templates: templates.toData()
        });

        user.on('destroy', () => this.users.delete(user.id));
    }

    send(name, data) {
        for (const [_, user] of this.users) {
            user.send(name, data);
        }
    }
}
