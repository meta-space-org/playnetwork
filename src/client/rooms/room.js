/**
 * TODO: Room
 * @name Room
 * @property {number} id id
 * @property {number} tickrate tickrate
 * @property {*} payload payload
 * @property {Players} players players
 */

/**
 * TODO: Player join
 *
 * @event Room#join
 * @type {object}
 * @property {Player} player
 */

/**
 * @event Room#leave
 * @description TODO
 * @type {object}
 * @property {Player} player
 */

/**
 * @event Room#destroy
 * @description TODO
 * @type {object}
 */
class Room extends pc.EventHandler {
    constructor(id, tickrate, payload, players) {
        super();

        this.id = id;
        this.tickrate = tickrate;
        this.payload = payload;
        this.players = new Players();

        this._hierarchyHandler = pc.app.loader.getHandler('hierarchy');
        this._entities = new Map();

        for (const key in players) {
            const { id, userData } = players[key];
            const user = pn.users.get(userData.id) || new User(userData.id);
            Players.create(id, user, this);
        }

        this.on('_player:join', this._onPlayerJoin, this);
        this.on('_player:leave', this._onPlayerLeave, this);

        this.on('_networkEntities:add', this._onNetworkEntityAdd, this);
        this.on('_networkEntities:create', this._onNetworkEntityCreate, this);
        this.on('_networkEntities:delete', this._onNetworkEntityDelete, this);
        this.on('_state:update', this._onUpdate, this);
    }

    /**
     * TODO: Send message to room
     *
     * @param {string} name
     * @param {*} data
     * @param {callback} callback
     */
    send(name, data, callback) {
        pn._send(name, data, 'room', this.id, callback);
    }

    /**
     * TODO: Leave room
     *
     * @param {callback} callback
     */
    leave(callback) {
        pn.rooms.leave(this.id, callback);
    }

    _onPlayerJoin({ id, userData }) {
        if (this.players.has(id)) return;

        const user = pn.users.get(userData.id) || new User(userData.id);
        const player = Players.create(id, user, this);

        this.fire('join', player);
        pn.rooms.fire('join', this, player);
    }

    _onPlayerLeave(id) {
        if (!this.players.has(id)) return;

        const player = this.players.get(id);
        player.destroy();

        this.fire('leave', player);
        pn.rooms.fire('leave', this, player);
    }

    _onNetworkEntityAdd(networkEntity) {
        if (this._entities.has(networkEntity.id))
            return;

        this._entities.set(networkEntity.id, networkEntity.entity);
    }

    _onNetworkEntityCreate(data) {
        const parentIndex = new Map();
        for (const id in data.entities) {
            const parentId = data.entities[id].parent;
            if (!parentId || data.entities[parentId]) continue;
            parentIndex.set(parentId, id);
            data.entities[id].parent = null;
        }

        const entity = this._hierarchyHandler.open('', data);
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

            this._entities.set(networkEntity.id, entity);
        });
    }

    _onNetworkEntityDelete(id) {
        const entity = this._entities.get(id);
        if (!entity) return;

        entity.destroy();
        this._entities.delete(id);
    }

    _onUpdate(data) {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const entity = this._entities.get(id);
            if (!entity) continue;
            entity.script.networkEntity.setState(data[i]);
        }
    }

    destroy() {
        this._entities = null;
        this.players = null;

        this.fire('destroy');
        this.off();
    }
}
