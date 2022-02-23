export default class Users extends Map {
    add(user) {
        this.set(user.id, user);

        user.send('_self', {
            user: user.toData()
        });

        user.once('destroy', () => this.delete(user.id));
    }

    send(name, data) {
        for (const [_, user] of this) {
            user.send(name, data);
        }
    }
}
