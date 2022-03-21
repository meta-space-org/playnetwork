class IdProvider {
    constructor() {
        this.ids = {
            user: 1,
            room: 1,
            player: 1,
            networkEntity: 1
        };
    }

    make(type) {
        return this.ids[type]++;
    }
}

export default new IdProvider();
