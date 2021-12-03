var PlayerController = pc.createScript('playerController');

PlayerController.attributes.add('speed', { type: 'number' });
PlayerController.attributes.add('bitmoji', { type: 'entity' });
PlayerController.attributes.add('linearDamping', { type: 'number', default: 1 });

PlayerController.prototype.initialize = function() {
    this.entity.on('networkEntity:sync', data => {
        this.entity.rigidbody.teleport(data.position.x, data.position.y, data.position.z);
        this.entity.script.networkEntity?.updateState({ position: data.position, velocity: data.velocity, yaw: data.yaw, jumped: data.jumped });
    });
};