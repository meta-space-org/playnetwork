import pn from '../index.js';

import entityToData from './entity-parser.js';

class NetworkEntities {
    static ids = 1;
    index = new Map();

    constructor(app) {
        this.app = app;
        this.app.on('_networkEntities:create', this.create, this);
    }

    create(script) {
        if (script.id) return;

        script.entity.forEach((e) => {
            if (!e.networkEntity) return;

            const id = NetworkEntities.ids++;
            e.networkEntity.id = id;
            this.index.set(id, e);
            pn.networkEntities.set(e.networkEntity.id, e.networkEntity);

            e.networkEntity.once('destroy', () => {
                if (!this.index.has(id)) return;

                e.forEach((x) => {
                    if (!x.networkEntity) return;
                    this.index.delete(x.networkEntity.id);
                    pn.networkEntities.delete(x.networkEntity.id);
                });

                this.app.room.send('_networkEntities:delete', id);
            });
        });

        this.app.room.send('_networkEntities:create', { entities: this.toData(script.entity) });
    }

    delete(id) {
        this.index.delete(id);
        pn.networkEntities.delete(id);
    }

    get(id) {
        return this.index.get(id) || null;
    }

    getState(force) {
        const state = [];
        for (const [_, entity] of this.index) {
            if (!entity.script || !entity.script.networkEntity)
                continue;

            const entityState = entity.script.networkEntity.getState(force);

            if (entityState)
                state.push(entityState);
        }
        return state;
    }

    toData(entity) {
        const entities = { };

        entity.forEach((e) => {
            if (!(e instanceof pc.Entity))
                return;

            const entityData = entityToData(e);
            entities[entityData.resource_id] = entityData;
        });

        return entities;
    }
}

export default NetworkEntities;
