import * as pc from 'playcanvas';

import node from './../index.js';
import entityToData from './entity-parser.js';

class NetworkEntities extends pc.EventHandler {
    index = new Map();

    constructor(app) {
        super();

        this.app = app;
        this.app.on('_networkEntities:create', this.create, this);
    }

    create(script) {
        if (script.id) return;

        script.entity.forEach((e) => {
            if (!e.networkEntity) return;

            const id = node.generateId('networkEntity');
            e.networkEntity.id = id;
            node.send('_routes:add', { type: 'networkEntities', id: id });
            this.index.set(id, e);
            node.networkEntities.set(e.networkEntity.id, e.networkEntity);

            e.networkEntity.once('destroy', () => {
                if (!this.index.has(id)) return;

                e.forEach((x) => {
                    if (!x.networkEntity) return;
                    node.send('_routes:remove', { type: 'networkEntities', id: x.networkEntity.id });
                    this.index.delete(x.networkEntity.id);
                    node.networkEntities.delete(x.networkEntity.id);
                });

                this.app.room.send('_networkEntities:delete', id);
            });
        });

        if (!this.app.frame) return;

        this.app.room.send('_networkEntities:create', { entities: this.toData(script.entity) });
    }

    delete(id) {
        this.index.delete(id);
        node.networkEntities.delete(id);
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

export default NetworkEntities;
