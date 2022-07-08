/**
 * @class Room
 * @classdesc Room to which {@link User} has joined.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID.
 * @property {number} tickrate Server tickrate of this {@link Room}.
 * @property {pc.Entity} root Root {@link pc.Entity} of this {@link Room}.
 * @property {number} latency Latency of this {@link Room} that takes in
 * account our network latency and server application update frequency.
 */

/**
 * @event Room#join
 * @description Fired when {@link User} has joined a {@link Room}.
 * @param {User} user {@link User} that is associated with this {@link Room}.
 */

/**
 * @event Room#leave
 * @description Fired when {@link User} has left a {@link Room}.
 * @param {User} user {@link User} that was associated with this {@link Room}.
 */

/**
 * @event Room#destroy
 * @description Fired when {@link Room} has been destroyed.
 */

class Room extends pc.EventHandler {
    constructor(id, tickrate, users) {
        super();

        this.id = id;
        this.tickrate = tickrate;
        this.users = new Map([[pn.me.id, pn.me]]);
        this.networkEntities = new NetworkEntities();

        this._hierarchyHandler = pc.app.loader.getHandler('hierarchy');

        this.root = null;
        this.latency = 0;

        for (const key in users) {
            const userData = users[key];
            const user = new User(userData.id);
            this.users.set(user.id, user);
        }

        this.on('_user:join', this._onUserJoin, this);
        this.on('_user:leave', this._onUserLeave, this);

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
     * @param {responseCallback} [callback] Response callback, which is called when
     * client receives server response for this specific message.
     */
    send(name, data, callback) {
        pn._send(name, data, 'room', this.id, callback);
    }

    _onUserJoin(userData) {
        const user = userData.id === pn.me.id ? pn.me : new User(userData.id);
        this.users.set(user.id, user);
        this.fire('join', user);
    }

    _onUserLeave(id) {
        const user = this.users.get(id);
        this.users.delete(user.id)
        this.fire('leave', user);
    }

    _onNetworkEntityAdd(networkEntity) {
        this.networkEntities.add(networkEntity);
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
            if (!networkEntity) return;

            this.networkEntities.add(networkEntity);
        });
    }

    _onNetworkEntityDelete(id) {
        const networkEntity = this.networkEntities.get(id);
        if (!networkEntity) return;

        networkEntity.entity.destroy();
    }

    _onUpdate(data) {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const networkEntity = this.networkEntities.get(id);
            if (!networkEntity) continue;
            networkEntity.setState(data[i]);
        }
    }

    destroy() {
        this.networkEntities = null;
        this.users = null;
        this.root.destroy();

        this.fire('destroy');
        this.off();
    }
}
