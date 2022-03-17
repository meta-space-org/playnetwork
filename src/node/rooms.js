import vm from 'vm';
import * as pc from 'playcanvas';

import node from './index.js';
import Room from './room.js';

/**
 * @class Rooms
 * @classdesc Interface with a list of all {@link PlayNetwork} {@link Room}s.
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
        node.on('_room:create', async (from, data, response) => {
            // TODO
            // this event can come from different scopes, ensure it is only from a user

            if (!this.hasEvent('create')) {
                response(new Error('No handlers bound to an rooms#create event on server'));
                return;
            }

            try {
                await this.fire('create', from, data);
                response();
            } catch (ex) {
                console.log('unable to create room');
                console.error(ex);
                response(ex);
            }
        });

        node.on('_room:join', async (from, roomId, response) => {
            // TODO
            // this event can come from different scopes, ensure it is only from a user

            const room = this.get(roomId);
            if (!room) {
                response(new Error(`Room ${roomId} not found`));
                return;
            }

            if (!this.hasEvent('join')) {
                response(new Error('No handlers bound to an rooms#join event on server'));
                return;
            }

            try {
                await this.fire('join', from, room);
                response();
            } catch (ex) {
                console.log('unable to join room');
                console.error(ex);
                response(ex);
            }
        });

        node.on('_room:leave', (from, roomId, response) => {
            // TODO
            // this event can come from different scopes, ensure it is only from a user

            const room = this.get(roomId);
            if (!room) {
                response(new Error(`Room ${roomId} not found`));
                return;
            }

            room.leave(from);
            response();

            this.fire('leave', from, room);
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
        let contextObject = {
            Room,
            roomId: await node.generateId('room'),
            tickrate,
            levelId,
            room: null,
            result: null
        };

        let context = vm.createContext(contextObject);
        vm.runInContext('this.room = new Room(this.roomId, this.tickrate); this.result = this.room.initialize(this.levelId);', context);
        await contextObject.result;

        let room = contextObject.room;
        this._rooms.set(room.id, room);

        room.once('destroy', () => {
            this._rooms.delete(room.id);
            contextObject = null;
            context = null;
            room = null;
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
