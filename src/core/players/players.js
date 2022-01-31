import Player from './player.js';

let lastPlayerId = 1;

export default class Players {
    players = new Map();
    playersByUserId = new Map();

    constructor(room) {
        this.room = room;
    }

    [Symbol.iterator]() {
        return this.players[Symbol.iterator]();
    }

    create(user) {
        const player = new Player(lastPlayerId++, user, this.room);
        this.players.set(player.id, player);
        this.playersByUserId.set(user.id, player);

        player.on('destroy', () => {
            this.players.delete(player.id);
            this.playersByUserId.delete(user.id);
        });

        return player;
    }

    get(playerId) {
        return this.players.get(playerId);
    }

    getByUserId(userId) {
        return this.playersByUserId.get(userId);
    }

    hasPlayers() {
        return this.players.size > 0;
    }

    send(name, data) {
        for (const [_, player] of this.players) {
            player.send(name, data);
        }
    }
}
