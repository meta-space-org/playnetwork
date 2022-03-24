class IdProvider {
    constructor() {
        this.ids = { };
    }

    make(type) {
        if (!this.ids[type])
            this.ids[type] = 0;

        return ++this.ids[type];
    }
}

export default new IdProvider();
