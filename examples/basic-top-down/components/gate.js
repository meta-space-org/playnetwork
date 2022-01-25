var Gate = pc.createScript('gate');

Gate.attributes.add('positionYCurve', { type: 'curve' });

Gate.prototype.initialize = function() {
    this.defaultPositionY = this.entity.getPosition().y;
    this.vec3 = new pc.Vec3();
    this.time = 0;
    this.activations = 0;

    this.entity.on('activation', (activated) => {
        this.activations += activated ? 1 : -1;
    });
};

Gate.prototype.update = function(dt) {
    this.time += this.activations > 0 ? dt : -dt;

    this.time = pc.math.clamp(this.time, 0, 1);

    this.vec3.copy(this.entity.getPosition());
    this.vec3.y = this.defaultPositionY + this.positionYCurve.value(this.time);

    this.entity.rigidbody.teleport(this.vec3);
};
