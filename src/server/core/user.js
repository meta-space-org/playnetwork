import * as pc from 'playcanvas';

/**
 * @class User
 * @description User interface which is created for each individual connection.
 * User can join multiple rooms, and will have unique {@link Player} per room.
 * @property {number} id Unique identifier per connection.
 * @property {Set<Room>} rooms List of {@link Room}s that user has joined.
 * @property {Set<Player>} players List of {@link Player}s belonging to a user,
 * one {@link Player} per {@link Room}.
 */

/**
 * @event User#disconnect
 * @description Fired when user gets disconnected,
 * before all related data is destroyed.
 */

/**
 * @event User#destroy
 * @description Fired after disconnect and related data is destroyed.
 */

export default class User extends pc.EventHandler {
    static _lastId = 1;

    constructor(socket) {
        super();

        this.id = User._lastId++;
        this.socket = socket;
        this.rooms = new Set();
        this.players = new Set();
        this.playersByRoom = new Map();
    }

    /**
     * @method send
     * @description Send a named message to a {@link User}.
     * @param {string} name Name of a message.
     * @param {object|array|string|number|boolean} [data] Optional message data.
     * Must be JSON friendly data.
     */
    send(name, data) {
        this._send(name, data, 'user');
    }

    _send(name, data, scope, id, msgId) {
        scope = {
            type: scope,
            id: id
        };

        this.socket.send(JSON.stringify({ name, data, scope, id: msgId }));
    }

    toData() {
        return {
            id: this.id
        };
    }

    addPlayer(player) {
        if (this.players.has(player))
            return;

        const room = player.room;
        this.rooms.add(room);

        // indices
        this.players.add(player);
        this.playersByRoom.set(player.room, player);

        player.once('destroy', () => {
            this.rooms.delete(room.id);
            this.players.delete(player);
            this.playersByRoom.delete(player.room);
        });
    }

    /**
     * @method getPlayerByRoom
     * @description Get {@link Player} of a {@link User} by {@link Room}.
     * @param {Room} room {@link Room} of which this {@link User} is a member.
     * @returns {Player|null} Player related to a specific {@link Room}
     * and this {@link User}
     */
    getPlayerByRoom(room) {
        return this.playersByRoom.get(room) || null;
    }

    /**
     * @method disconnect
     * @description Force disconnect a {@link User}.
     */
    disconnect() {
        if (!this.socket) return;
        this.socket.close();
    }

    destroy() {
        if (!this.socket)
            return;

        this.fire('disconnect');

        for (const [_, room] of this.rooms) {
            room.leave(this);
        }

        this.socket = null;
        this.rooms = null;
        this.players = null;

        this.fire('destroy');
        this.off();
    }
}
