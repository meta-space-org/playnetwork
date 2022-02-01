var FloorCell = pc.createScript('floorCell');

FloorCell.attributes.add('tags', { type: 'string', array: true });
FloorCell.attributes.add('color', { type: 'rgb' });

FloorCell.prototype.initialize = function() {
    this.activations = 0;

    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
};

FloorCell.prototype.swap = function(old) {
    this.activations = old.activations;

    this.entity.collision.off('triggerenter', old.onTriggerEnter, old);
    this.entity.collision.off('triggerleave', old.onTriggerLeave, old);

    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
};

FloorCell.prototype.onTriggerEnter = function(entity) {
    if (!entity || !this.hasTag(entity.tags))
        return;

    this.activations++;
    this.onActivationsChanged();
};

FloorCell.prototype.onTriggerLeave = function(entity) {
    if (!entity || !this.hasTag(entity.tags))
        return;

    this.activations--;
    this.onActivationsChanged();
};

FloorCell.prototype.onActivationsChanged = function() {
    if (this.activations > 0) {
        this.color.set(1, 0, 1);
    } else {
        this.color.set(0, 0, 0);
    }
};

FloorCell.prototype.hasTag = function(tags) {
    for (let i = 0; i < this.tags.length; i++) {
        if (tags.has(this.tags[i]))
            return true;
    }

    return false;
};
