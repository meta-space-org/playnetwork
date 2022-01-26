var FloorButton = pc.createScript('floorButton');

FloorButton.attributes.add('positionYCurve', { type: 'curve' });
FloorButton.attributes.add('triggerEntity', { type: 'entity' });
FloorButton.attributes.add('connectedEntity', { type: 'entity' });
FloorButton.attributes.add('tags', { type: 'string', array: true });

FloorButton.prototype.initialize = function() {
    this.defaultPositionY = this.entity.getPosition().y;
    this.vec3 = this.entity.getPosition().clone();
    this.time = 0;
    this.activations = 0;

    this.triggerEntity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.triggerEntity.collision.on('triggerleave', this.onTriggerLeave, this);
};

FloorButton.prototype.swap = function(old) {
    this.defaultPositionY = old.defaultPositionY;
    this.vec3 = old.vec3;
    this.time = old.time;
    this.activations = old.activations;

    this.triggerEntity.collision.off('triggerenter', old.onTriggerEnter, old);
    this.triggerEntity.collision.off('triggerleave', old.onTriggerLeave, old);

    this.triggerEntity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.triggerEntity.collision.on('triggerleave', this.onTriggerLeave, this);
};

FloorButton.prototype.update = function(dt) {
    if (!this.entity.rigidbody)
        return;

    this.time += (this.activations > 0 ? dt : -dt) * 5;
    this.time = pc.math.clamp(this.time, 0, 1);
    this.vec3.y = this.defaultPositionY + this.positionYCurve.value(this.time);

    this.entity.rigidbody.teleport(this.vec3);
};

FloorButton.prototype.onTriggerEnter = function(entity) {
    if (!entity || !this.hasTag(entity.tags))
        return;

    this.activations++;
    this.connectedEntity.fire('activation', true);
};

FloorButton.prototype.onTriggerLeave = function(entity) {
    if (!entity || !this.hasTag(entity.tags))
        return;

    this.activations--;
    this.connectedEntity.fire('activation', false);
};

FloorButton.prototype.hasTag = function(tags) {
    for (let i = 0; i < this.tags.length; i++) {
        if (tags.has(this.tags[i]))
            return true;
    }

    return false;
};
