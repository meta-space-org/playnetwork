var Game = pc.createScript('game');

Game.prototype.initialize = function() {
    this.networkEntities = this.app.room.networkEntities;
    this.players = new Map();
    this.handlers = new Map();

    this.tplPlayer = this.app.assets.get(61886320).resource;

    this.on('join', this.onJoin);
    this.on('leave', this.onLeave);
};

Game.prototype.swap = function(old) {
    this.networkEntities = old.networkEntities;
    this.players = old.players;
    this.handlers = old.handlers;

    this.tplPlayer = old.tplPlayer;

    old.off('join', old.onJoin);
    old.off('leave', old.onLeave);

    this.on('join', this.onJoin);
    this.on('leave', this.onLeave);
};

Game.prototype.onJoin = function(user) {
    // player entity
    const entity = this.tplPlayer.instantiate();
    entity.name = 'Player ' + user.id;
    entity.script.networkEntity.owner = user.id;
    this.entity.addChild(entity);
    this.players.set(user.id, entity);

    // handlers of user messages
    let handlers = this.handlers.get(user.id);
    if (! handlers) {
        handlers = { };
        this.handlers.set(user.id, handlers);
    }

    // apply player:input on player controlled entity
    handlers['player:input'] = (data) => {
        entity.script.playerController.setInput(data);
    };
    user.socket.on('player:input', handlers['player:input']);
};

Game.prototype.onLeave = function(user) {
    const entity = this.players.get(user.id);
    if (! entity) return;

    entity.destroy();
    this.players.delete(user.id);

    // remove user message handlers
    const handlers = this.handlers.get(user.id);
    if (handlers) {
        for(let key in handlers) {
            user.socket.off(key, handlers[key]);
        }
        this.handlers.delete(user.id);
    }
};

Game.prototype.toData = function() {
    return {
        players: this.players
    }
};
