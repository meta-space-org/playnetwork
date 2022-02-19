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

/**
 * Room
 */
class Room extends pc.EventHandler {
    constructor(id, tickrate, payload) {
        super();

        this.id = id;
        this.tickrate = tickrate;
        this.payload = payload;

        this.hierarchyHandler = pc.app.loader.getHandler('hierarchy');
        this.entities = new Map();
        this.players = new Map();

        this.on('_player:join', this._onPlayerJoin, this);
        this.on('_player:leave', this._onPlayerLeave, this);

        this.on('_networkEntities:add', this._onNetworkEntityAdd, this);
        this.on('_networkEntities:create', this._onNetworkEntityCreate, this);
        this.on('_networkEntities:delete', this._onNetworkEntityDelete, this);
        this.on('_state:update', this._onUpdate, this);
    }

    send(name, data, callback) {
        pn._send(name, data, 'room', this.id, callback);
    }

    leave(callback) {
        pn.rooms.leave(this.id, callback);
    }

    _onPlayerJoin({ id, user }) {
        if (this.players.has(id)) return;

        const player = new Player(id, user, this);
        this.players.set(id, player);
        pn.players.set(id, player);

        this.fire('join', player);
    }

    _onPlayerLeave(id) {
        if (!this.players.has(id)) return;

        const player = this.players.get(id);
        this.players.delete(id);
        player.destroy();

        this.fire('leave', player);
    }

    _onNetworkEntityAdd(networkEntity) {
        if (this.entities.has(networkEntity.id))
            return;

        this.entities.set(networkEntity.id, networkEntity.entity);
    }

    _onNetworkEntityCreate(data) {
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

    _onNetworkEntityDelete(id) {
        const entity = this.entities.get(id);
        if (!entity) return;

        entity.destroy();
        this.entities.delete(id);
    }

    _onUpdate(data) {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const entity = this.entities.get(id);
            if (!entity) continue;
            entity.script.networkEntity.setState(data[i]);
        }
    }

    _destroy() {
        this.off();

        for (const [_, player] of this.players) {
            player.destroy();
        }

        this.entities = null;
        this.players = null;
    }
}
