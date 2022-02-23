/**
 * TODO
 * @name Players
 */
export default class Players extends Map {
    _playersByUser = new Map();
    _playersByRoom = new Map();

    add(player) {
        this.set(player.id, player);
        this._playersByUser.set(player.user.id, player);
        this._playersByRoom.set(player.room.id, player);

        player.once('destroy', () => {
            this.delete(player.id);
            this._playersByUser.delete(player.user.id);
            this._playersByRoom.delete(player.room.id);
        });

        return player;
    }

    /**
     * TODO
     * @param {*} id
     * @returns {Player}
     */
    getByUserId(id) {
        return this._playersByUser.get(id);
    }

    /**
     * TODO
     * @param {*} id
     * @returns {Player}
     */
    getByRoomId(id) {
        return this._playersByRoom.get(id);
    }

    toData() {
        const data = {};

        for (const [_, player] of this) {
            data[player.id] = player.toData();
        }

        return data;
    }
}
