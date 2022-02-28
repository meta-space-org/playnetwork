/**
 * TODO: Network entities collection
 * @name NetworkEntities
 */
 class NetworkEntities extends pc.EventHandler {
    constructor() {
        super();

        this._index = new Map();
    }

    /**
     * TODO: Get player by id
     * @param {number} id
     * @returns {Player|null}
     */
    get(id) {
        return this._index.get(id);
    }

    /**
     * TODO: Is player exist
     * @param {number} id
     * @returns {boolean}
     */
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