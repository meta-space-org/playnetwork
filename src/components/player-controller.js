var PlayerController = pc.createScript('playerController');

PlayerController.attributes.add('speed', { type: 'number' });
PlayerController.attributes.add('jumpForce', { type: 'number', default: 1500 });

PlayerController.prototype.swap = function() { };

PlayerController.prototype.update = function() {
    // respawn if fell below the floor
    if (this.entity.getPosition().y < -4) {
        this.entity.setPosition(0, 4, 0);
        this.entity.rigidbody.teleport(0, 0, 0);
        this.entity.rigidbody.linearVelocity = this.entity.rigidbody.linearVelocity.set(0, 0, 0);
    }
};

PlayerController.prototype.setInput = function(data) {
    this.entity.rigidbody.teleport(data.position.x, data.position.y, data.position.z);
    this.entity.rigidbody.linearVelocity = this.entity.rigidbody.linearVelocity.set(data.linearVelocity.x, data.linearVelocity.y, data.linearVelocity.z);
    this.entity.rigidbody.angularVelocity = this.entity.rigidbody.angularVelocity.set(data.angularVelocity.x, data.angularVelocity.y, data.angularVelocity.z);
};
