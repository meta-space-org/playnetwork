var Game = pc.createScript('game');

Game.prototype.initialize = function() {
    this.networkEntities = this.app.room.networkEntities;
    this.players = new Map();

    this.tplPlayer = this.app.assets.get(61886320).resource;

    this.app.room.on('join', this.onJoin, this);
    this.app.room.on('leave', this.onLeave, this);

    this.once('destroy', () => {
        this.app.room.off('join', this.onJoin, this);
        this.app.room.off('leave', this.onLeave, this);
    });
};

Game.prototype.swap = function(old) {
    this.networkEntities = old.networkEntities;
    this.players = old.players;

    this.tplPlayer = old.tplPlayer;

    old.app.room.off('join', old.onJoin, this);
    old.app.room.off('leave', old.onLeave, this);

    this.app.room.on('join', this.onJoin, this);
    this.app.room.on('leave', this.onLeave, this);
};

Game.prototype.onJoin = function(player) {
    // player entity
    const entity = this.tplPlayer.instantiate(this.app);
    entity.name = 'Player ' + player.id;
    entity.script.networkEntity.owner = player.id;
    this.entity.addChild(entity);
    this.players.set(player.id, entity);
};

Game.prototype.onLeave = function(player) {
    const entity = this.players.get(player.id);
    if (!entity) return;

    entity.destroy();
    this.players.delete(player.id);
};

Game.prototype.toData = function() {
    return {
        players: this.players
    };
};
