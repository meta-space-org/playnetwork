import templates from '../core/templates.js';

export default class Users extends Map {
    add(user) {
        this.set(user.id, user);

        user.send('_self', {
            user: user.toData(),
            templates: templates.toData()
        });

        user.on('destroy', () => this.delete(user.id));
    }

    send(name, data) {
        for (const [_, user] of this) {
            user.send(name, data);
        }
    }
}
