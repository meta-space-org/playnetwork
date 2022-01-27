var Game = pc.createScript('game');

Game.prototype.initialize = function() {
    this.networkEntities = this.app.room.networkEntities;
    this.players = new Map();

    this.tplPlayer = this.app.assets.get(61886320).resource;

    this.app.on('join', this.onJoin, this);
    this.app.on('leave', this.onLeave, this);

    this.on('destroy', () => {
        this.app.off('join', this.onJoin, this);
        this.app.off('leave', this.onLeave, this);
    })
};

Game.prototype.swap = function(old) {
    this.networkEntities = old.networkEntities;
    this.players = old.players;

    this.tplPlayer = old.tplPlayer;

    old.app.off('join', old.onJoin, this);
    old.app.off('leave', old.onLeave, this);

    this.app.on('join', this.onJoin, this);
    this.app.on('leave', this.onLeave, this);
};

Game.prototype.onJoin = function(user) {
    // player entity
    const entity = this.tplPlayer.instantiate();
    entity.name = 'Player ' + user.id;
    entity.script.networkEntity.owner = user.id;
    this.entity.addChild(entity);
    this.players.set(user.id, entity);
};

Game.prototype.onLeave = function(user) {
    const entity = this.players.get(user.id);
    if (! entity) return;

    entity.destroy();
    this.players.delete(user.id);
};

Game.prototype.toData = function() {
    return {
        players: this.players
    }
};
