/**
 * Room
 * @name Room
 */
class Room extends pc.EventHandler {
    constructor(id, tickrate, payload, players) {
        super();

        /**
         * @type {number}
         */
        this.id = id;

        /**
         * @type {number}
         */
        this.tickrate = tickrate;

        /**
         * @type {*}
         */
        this.payload = payload;

        this.hierarchyHandler = pc.app.loader.getHandler('hierarchy');
        this.entities = new Map();
        this.players = new Players();

        for (const key in players) {
            const { id, user } = players[key];
            const player = new Player(id, user, this);
            this.players._add(player);
        }

        this.on('_player:join', this._onPlayerJoin, this);
        this.on('_player:leave', this._onPlayerLeave, this);

        this.on('_networkEntities:add', this._onNetworkEntityAdd, this);
        this.on('_networkEntities:create', this._onNetworkEntityCreate, this);
        this.on('_networkEntities:delete', this._onNetworkEntityDelete, this);
        this.on('_state:update', this._onUpdate, this);
    }

    /**
     * Send message to room
     *
     * @param {string} name
     * @param {*} data
     * @param {callback} callback
     */
    send(name, data, callback) {
        pn._send(name, data, 'room', this.id, callback);
    }

    /**
     * Leave room
     *
     * @param {callback} callback
     */
    leave(callback) {
        pn.rooms.leave(this.id, callback);
    }

    _onPlayerJoin({ id, user }) {
        if (this.players.has(id)) return;

        const player = new Player(id, user, this);
        this.players._add(player);

        this.fire('join', player);
        pn.rooms.fire('join', this, player);
    }

    _onPlayerLeave(id) {
        if (!this.players.has(id)) return;

        const player = this.players.get(id);
        player._destroy();

        this.fire('leave', player);
        pn.rooms.fire('leave', this, player);
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
        this.entities = null;
        this.players = null;

        this.fire('destroy');
        this.off();
    }
}

/**
 * Player join
 *
 * @event Room#join
 * @type {object}
 * @property {Player} player
 */

/**
 * Player leave
 *
 * @event Room#leave
 * @type {object}
 * @property {Player} player
 */

/**
 * Destroyed
 *
 * @event Room#destroy
 * @type {object}
 */
