/**
 * @class Room
 * @classdesc Room to which {@link User} has joined.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID.
 * @property {number} tickrate Server tickrate of this {@link Room}.
 * @property {Set<Player>} players List of {@link Player}s of this {@link Room}.
 * Each joined {@link User} has {@link Player} associated with this {@link Room}.
 */

/**
 * @event Room#join
 * @description Fired when {@link User} has joined a {@link Room}.
 * @param {Player} player {@link Player} that is associated with a joined
 * {@link User} and this {@link Room}.
 */

/**
 * @event Room#leave
 * @description Fired when {@link User} has left a {@link Room}.
 * @param {Player} player {@link Player} that was associated with joined {@link User}.
 */

/**
 * @event Room#destroy
 * @description Fired when {@link Room} has been destroyed.
 */

class Room extends pc.EventHandler {
    constructor(id, tickrate, players) {
        super();

        this.id = id;
        this.tickrate = tickrate;
        this.players = new Set();

        this._hierarchyHandler = pc.app.loader.getHandler('hierarchy');
        this._networkEntities = new NetworkEntities();

        for (const key in players) {
            const { id, userData } = players[key];
            const user = pn.users.get(userData.id) || new User(userData.id);
            new Player(id, user, this);
        }

        this.on('_player:join', this._onPlayerJoin, this);
        this.on('_player:leave', this._onPlayerLeave, this);

        this.on('_networkEntities:add', this._onNetworkEntityAdd, this);
        this.on('_networkEntities:create', this._onNetworkEntityCreate, this);
        this.on('_networkEntities:delete', this._onNetworkEntityDelete, this);
        this.on('_state:update', this._onUpdate, this);
    }

    /**
     * @method send
     * @description Send a named message to a {@link Room}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Data of a message.
     * Must be JSON friendly data.
     * @param {callback} [callback] Response callback, which is called when
     * client receives server response for this specific message.
     */
    send(name, data, callback) {
        pn._send(name, data, 'room', this.id, callback);
    }

    /**
     * @method leave
     * @description Request to leave a room.
     * @param {callback} [callback] Response callback, which is called when
     * client receives server response for this specific request.
     */
    leave(callback) {
        pn.rooms.leave(this.id, callback);
    }

    _onPlayerJoin({ id, userData }) {
        if (this.players.has(id)) return;

        const user = pn.users.get(userData.id) || new User(userData.id);
        const player = new Player(id, user, this);

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
        this._networkEntities.add(networkEntity);
        pn.networkEntities.add(networkEntity);
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

            this._networkEntities.add(networkEntity);
            pn.networkEntities.add(networkEntity);
        });
    }

    _onNetworkEntityDelete(id) {
        const networkEntity = this._networkEntities.get(id);
        if (!networkEntity) return;

        networkEntity.entity.destroy();
    }

    _onUpdate(data) {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const networkEntity = this._networkEntities.get(id);
            if (!networkEntity) continue;
            networkEntity.setState(data[i]);
        }
    }

    destroy() {
        this._networkEntities = null;
        this.players = null;

        this.fire('destroy');
        this.off();
    }
}
