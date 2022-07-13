import * as pc from 'playcanvas';
import levels from '../libs/levels.js';

import pn from './../index.js';
import Room from './room.js';

/**
 * @class Rooms
 * @classdesc Interface with a list of all {@link Room}s and new rooms creation logic.
 * @extends pc.EventHandler
 */

/**
 * @event Rooms#join
 * @description Fired when a {@link User} successfully joined a {@link Room}.
 * @async
 * @param {Room} room {@link Room} to which a {@link User} joined.
 * @param {User} user {@link User} who joined.
 */

/**
 * @event Rooms#leave
 * @description Fired when a {@link User} left a {@link Room}.
 * @param {Room} room {@link Room} from which a {@link User} has left.
 * @param {User} user {@link User} who has left.
 */

class Rooms extends pc.EventHandler {
    _index = new Map();

    initialize() {
        pn.on('_room:create', async (sender, data, callback) => {
            if (!data?.levelId) return callback(new Error('No levelId provided'));
            if (!(await levels.has(data?.levelId))) return callback(new Error('Level not found'));

            const room = await this.create(data.levelId, data.tickrate);
            callback(null, room.id);
        });

        pn.on('_room:join', async (sender, id, callback) => {
            if (!id) return callback(new Error('No id provided'));
            // eslint-disable-next-line node/no-callback-literal
            callback(await sender.join(id));
        });

        pn.on('_room:leave', async (sender, _, callback) => {
            // eslint-disable-next-line node/no-callback-literal
            callback(await sender.leave());
        });
    }

    /**
     * @function create
     * @description Function to create a new {@link Room}.
     * It will load a level by provided ID and start new {@link Room} with a {@link pc.Application}.
     * @async
     * @param {number} levelId ID Number of a level.
     * @param {number} [tickrate=20] Tick rate - is how many times Application
     * will be calling `update` in a second.
     * @returns {Room} Room that has been created.
     */
    async create(levelId, tickrate = 20) {
        const roomId = await pn.generateId('room');

        const room = new Room(roomId, tickrate);
        await room.initialize(levelId);

        this._index.set(room.id, room);

        room.once('destroy', () => {
            this._index.delete(room.id);
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
        return this._index.get(id) || null;
    }

    /**
     * @method has
     * @description Check if a {@link Room} with a specific ID exists.
     * @param {number} id ID of a {@link Room}.
     * @returns {boolean}
     */
    has(id) {
        return this._index.has(id);
    }
}

export default Rooms;
