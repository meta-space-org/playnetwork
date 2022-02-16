/*

Events:

    join (player)
    leave (player)

Properties:

    id:int
    type:string
    players:Players

Methods:

    leave()
    send(name, data, [callback])
    getPlayerByUser(user)

*/

import Player from '../player.js';

export default class Room extends pc.EventHandler {
    constructor(id, tickrate, payload) {
        super();

        this.id = id;
        this.tickrate = tickrate;
        this.payload = payload;

        this.hierarchyHandler = pc.app.loader.getHandler('hierarchy');
        this.entities = new Map();
        this.players = new Map();

        this.on('_player:join', this.onPlayerJoin, this);
        this.on('_player:leave', this.onPlayerLeave, this);

        this.on('_networkEntities:add', this.onNetworkEntityAdd, this);
        this.on('_networkEntities:create', this.onNetworkEntityCreate, this);
        this.on('_networkEntities:delete', this.onNetworkEntityDelete, this);
        this.on('_state:update', this.onUpdate, this);
    }

    onPlayerJoin({ id, user }) {
        if (this.players.has(id)) return;

        const player = new Player(id, user, this);
        this.players.set(id, player);
        pn.players.set(id, player);

        this.fire('join', player);
    }

    onPlayerLeave(id) {
        if (!this.players.has(id)) return;

        const player = this.players.get(id);
        this.players.delete(id);
        player.destroy();

        this.fire('leave', player);
    }

    onNetworkEntityAdd(networkEntity) {
        if (this.entities.has(networkEntity.id))
            return;

        this.entities.set(networkEntity.id, networkEntity.entity);
    }

    onNetworkEntityCreate(data) {
        const parentIndex = new Map();
        for (const id in data.entities) {
            const parentId = data.entities[id].parent;
            if (!parentId || data.entities[parentId]) continue;
            parentIndex.set(parentId, id);
            data.entities[id].parent = null;
        }

        const entity = this.hierarchyHandler.open('', data);
        const wasEnabled = entity.enabled;
        entity.enabled = false;

        for (const [parentId, id] of parentIndex) {
            const parent = pc.app.root.findByGuid(parentId);
            const child = entity.getGuid() === id ? entity : entity.findByGuid(id);

            if (!parent) {
                console.log(`entity ${child.name} unknown parent ${parentId}`);
                continue;
            }

            parent.addChild(child);
        }

        entity.enabled = wasEnabled;

        entity.forEach((entity) => {
            const networkEntity = entity?.script?.networkEntity;
            if (!networkEntity)
                return;

            this.entities.set(networkEntity.id, entity);
        });
    }

    onNetworkEntityDelete(id) {
        const entity = this.entities.get(id);
        if (!entity) return;

        entity.destroy();
        this.entities.delete(id);
    }

    onUpdate(data) {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const entity = this.entities.get(id);
            if (!entity) continue;
            entity.script.networkEntity.setState(data[i]);
        }
    }

    leave(callback) {
        pn.rooms.leave(this.id, callback);
    }

    destroy() {
        this.off();

        for (const [_, player] of this.players) {
            player.destroy();
        }

        this.entities = null;
        this.players = null;
    }
}
