export default class Players extends Map {
    playersByUser = new Map();
    playersByRoom = new Map();

    _add(player) {
        this.set(player.id, player);
        this.playersByUser.set(player.user.id, player);
        this.playersByRoom.set(player.room.id, player);

        player.on('destroy', () => {
            this.delete(player.id);
            this.playersByUser.delete(player.user.id);
            this.playersByRoom.delete(player.room.id);
        });

        return player;
    }

    getByUserId(userId) {
        return this.playersByUser.get(userId);
    }

    getByRoomId(roomId) {
        return this.playersByRoom.get(roomId);
    }

    toData() {
        const data = {};

        for (const [_, player] of this) {
            data[player.id] = player.toData();
        }

        return data;
    }

    send(name, data) {
        for (const [_, player] of this) {
            player.send(name, data);
        }
    }
}
