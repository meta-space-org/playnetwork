export default class NetworkEntity {
    constructor(id, syncInterval, entity) {
        this.id = id;
        this.syncInterval = syncInterval;
        this.entity = entity;
        this.isDirty = false;
        this.state = {};
    }
}
