import * as pc from 'playcanvas';

import pn from './../index.js';
import Room from './room.js';

/**
 * @class Rooms
 * @classdesc Interface with a list of all {@link Node} {@link Room}s. Client
 * can send a room creation and join request, it is up to application logic to
 * handle those requests and call create/join.
 * @extends pc.EventHandler
 */

/**
 * @event Rooms#create
 * @description Fired when {@link User} has requested room creation, with provided data.
 * {@link Room} will not be created automatically, it is up to an application logic to decide.
 * @async
 * @param {User} from Who have sent a request.
 * @param {object} data Data of a request.
 */

/**
 * @event Rooms#join
 * @description Fired when a {@link User} requests to join a {@link Room}.
 * {@link User} will not join automatically, it is up to an application logic to decide.
 * @async
 * @param {User} user User who have requested to join a {@link Room}.
 * @param {Room} room Room to which a {@link User} has requested to join.
 */

/**
 * @event Rooms#leave
 * @description Fired when a {@link User} leaves a {@link Room}.
 * {@link User} will leave upon a request.
 * @param {User} user User who have left a {@link Room}.
 * @param {Room} room Room from which a {@link User} has left.
 */

class Rooms extends pc.EventHandler {
    _rooms = new Map();

    initialize() {
        pn.on('_room:create', async (sender, data, callback) => {
            const room = await this.create(data.levelId, data.tickrate);
            callback(null, room.id);
        });

        pn.on('_room:join', async (sender, id, callback) => {
            await sender.join(id);
            callback();
        });

        pn.on('_room:leave', (sender, _, callback) => {
            sender.leave();
            callback();
        });

        pn.on('test', async (sender, userId, callback) => {
            const user = await pn.users.get(userId);
            user.send('testOOO', { x: 100, y: 100 });
        });
    }

    /**
     * @function create
     * @description Function to create a new Room.
     * It will load a level by provided ID and start new context
     * with a PlayCanvas Application.
     * @async
     * @param {number} levelId ID Number of a level.
     * @param {number} tickrate Tick rate - is how many times Application
     * will be calling `update` in a second.
     * @returns {Room} room Room that has been created.
     */
    async create(levelId, tickrate) {
        const roomId = await pn.generateId('room');

        const room = new Room(roomId, tickrate);
        await room.initialize(levelId);

        this._rooms.set(room.id, room);

        room.once('destroy', () => {
            this._rooms.delete(room.id);
        });

        return room;
    }

    /**
     * @method get
     * @description Get a {@link Room} by ID.
     * @param {number} id ID of a {@link Room}.
     * @returns {Room|null}
     */
    get(id) {
        return this._rooms.get(id) || null;
    }

    /**
     * @method has
     * @description Check a {@link Room} with a specific ID exists.
     * @param {number} id ID of a {@link Room}.
     * @returns {boolean}
     */
    has(id) {
        return this._rooms.has(id);
    }
}

export default Rooms;
