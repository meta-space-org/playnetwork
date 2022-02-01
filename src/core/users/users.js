import templates from '../templates.js';

export default class Users {
    users = new Map();

    add(user) {
        this.users.set(user.id, user);

        user.send('self', {
            userId: user.id,
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
