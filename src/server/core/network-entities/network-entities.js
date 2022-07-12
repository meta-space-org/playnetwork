import * as pc from 'playcanvas';

import pn from './../../index.js';
import entityToData from './entity-parser.js';

export default class NetworkEntities extends pc.EventHandler {
    index = new Map();
    entitiesInProcess = 0;

    constructor(app) {
        super();

        this.app = app;
    }

    create(script) {
        script.entity.forEach((e) => {
            if (!e.networkEntity) return;

            const id = pn.generateId('networkEntity');
            e.networkEntity.id = id;
            this.index.set(id, e);
            pn.networkEntities.set(id, e.networkEntity);

            e.networkEntity.once('destroy', () => {
                if (!this.index.has(id)) return;

                e.forEach((x) => {
                    if (!x.networkEntity) return;
                    this.index.delete(id);
                    pn.networkEntities.delete(id);
                    pn.redis.HDEL('_route:networkEntity', id.toString());
                });

                this.app.room.send('_networkEntities:delete', id);
            });
        });

        if (!this.app.frame) return;

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
        for (const entity of this.index.values()) {
            if (!entity.script || !entity.script.networkEntity)
                continue;

            const entityState = entity.script.networkEntity.getState(force);

            if (entityState)
                state.push(entityState);
        }
        return state;
    }

    toData(entity) {
        const entities = {};

        entity.forEach((e) => {
            if (!(e instanceof pc.Entity))
                return;

            const entityData = entityToData(e);
            entities[entityData.resource_id] = entityData;
        });

        return entities;
    }
}
