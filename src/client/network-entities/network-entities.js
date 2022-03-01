 class NetworkEntities {
    constructor() {
        this._index = new Map();
    }

    get(id) {
        return this._index.get(id);
    }

    has(id) {
        return this._index.has(id);
    }

    add(networkEntity) {
        if (this.has(networkEntity.id)) return;

        this._index.set(networkEntity.id, networkEntity);

        networkEntity.entity.once('destroy', () => {
            this._index.delete(networkEntity.id)
        });
    }
}
