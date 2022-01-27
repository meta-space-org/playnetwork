import entityToData from './entity-parser.js';

class NetworkEntities {
    ids = 0;
    index = new Map();

    constructor(app) {
        this.app = app;
        this.app.on('networkEntities:create', this.create, this);
    }

    makeId() {
        return ++this.ids;
    }

    create(script) {
        const id = this.makeId();
        script.id = id;
        this.set(id, script.entity);

        script.once('destroy', () => {
            this.index.delete(id);
            this.app.room.send('networkEntities:delete', id);
        });
    }

    set(id, entity) {
        this.index.set(id, entity);
        this.app.room.send('networkEntities:create', { entities: this.toData(entity) });
    }

    delete(id) {
        this.index.delete(id);
    }

    get(id) {
        return this.index.get(id) || null;
    }

    getState() {
        const state = [ ];
        for(const [id, entity] of this.index) {
            if (!entity.script || ! entity.script.networkEntity)
                continue;

            const entityState = entity.script.networkEntity.getState();

            if (entityState)
                state.push(entityState);
        }
        return state;
    }

    toData(entity) {
        const entities = { };

        entity.forEach((e) => {
            if (! (e instanceof pc.Entity))
                return;

            let entityData = entityToData(e);
            entities[entityData.resource_id] = entityData;
        });

        return entities;
    }
}

export default NetworkEntities;
