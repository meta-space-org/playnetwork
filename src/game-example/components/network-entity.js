var NetworkEntity = pc.createScript('networkEntity');

NetworkEntity.attributes.add('syncInterval', { type: 'number', placeholder: 'ticks' });
NetworkEntity.attributes.add('id', { type: 'number', default: -1 });

NetworkEntity.prototype.updateState = function(state) {
    this.app.fire('networkEntity:state:update', this.id, state);
}