var SyncTransform = pc.createScript('syncTransform');

SyncTransform.prototype.update = function(dt) {
    this.entity.script.networkEntity?.updateState({ position: this.entity.getPosition(), rotation: this.entity.getRotation(), scale: this.entity.getLocalScale() });
};