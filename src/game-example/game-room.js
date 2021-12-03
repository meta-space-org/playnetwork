import AppHandler from '../core/app-handler.js';

import NetworkEntity from '../core/models/network-entity.js';
import Player from '../core/models/player.js';

import templates     from './templates/templates.js';

import { optimize } from '../core/utils.js';

export default class GameRoom {
    constructor(id) {
        this.id = id;

        this.app = null;
        this.level = null;
        this.networkEntities = new Map();
        this.lastNetworkEntityId = 0;

        this.players = new Map();
        this.createdEntities = [];

        this.tick = 0;
        this.tickrate = 30;
        this.lastTickTime = Date.now();
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;
    }

    async onCreateRoom(selectedLevelId) {
        await this.onRoomTick();
 
        const { lastNetworkEntityId, networkEntities, level, app } = await AppHandler.createApp(selectedLevelId);

        this.app = app;
        this.level = level;
        this.networkEntities = networkEntities;
        this.lastNetworkEntityId = lastNetworkEntityId;

        this.app.on('networkEntity:state:update', (id, state) => {
            const networkEntity = networkEntities.get(id);
            networkEntity.isDirty = true;

            if (!state)
                return;

            for (let key in state) {
                networkEntity.state[key] = state[key];
            }
        });

        this.app.start();
    }

    async onJoinRoom(socket) {
        this.initializeEvents(socket);

        this.players.set(socket.id, new Player(socket.id));

        return { roomId: this.id, level: this.level };
    }

    async onLeftRoom(socket) {
        socket.removeAllListeners('player:moved');

        const player = this.players.get(socket.id);
        const entityIndex = this.createdEntities.findIndex(e => e.scripts?.networkEntity?.id == player.networkEntityId);
        this.players.delete(socket.id);
        this.createdEntities.splice(entityIndex, 1);
       
        NETWORK.io.to(this.id).emit('player:left', player.networkEntityId);

        if (!this.players.size) {
            this.app.destroy();
            delete this.app;
        }
    }

    async onRoomTick() {
        this.currentTickTime = Date.now();
        this.dt = (this.currentTickTime - this.lastTickTime) / 1000;
        this.lastTickTime = this.currentTickTime;
        this.tick++;

        this.tickTimeout = setTimeout(async () => await this.onRoomTick(), 1000 / this.tickrate);

        if (!this.app || !this.players.size)
            return;

        try {
            this.app.update(this.dt);

            this.networkEntitiesToSync = this.getNetworkEntitiesToSync();
    
            if (this.networkEntitiesToSync.length) {
                this.networkEntitiesToSync = optimize(this.networkEntitiesToSync, 3);
    
                NETWORK.io.to(this.id).emit('networkEntities:sync', this.networkEntitiesToSync);
            }
        }
        catch (e) {
            console.err(e);
        }
    }

    initializeEvents(socket) {
        socket.on('player:moved', async (data) => {
            if (!data)
                return;

            const networkEntity = this.networkEntities.get(data.networkEntityId);

            if (!networkEntity || !networkEntity.entity)
                return;
    
            networkEntity.entity.fire('networkEntity:sync', data);
        });
    }

    async createPlayerEntity(player) {
        const networkEntity = new NetworkEntity(this.lastNetworkEntityId++, 1);
        this.networkEntities.set(networkEntity.id, networkEntity);
        player.networkEntityId = networkEntity.id;

        this.createEntity({
            templateId: 61886320,
            scripts: { networkEntity: { id: networkEntity.id, syncInterval: 1, ownerId: player.id, type: 'player', data: {
                name: 'User ' + Date.now()
            }}},
        });
    }

    async createEntity(data) {
        const template = new pc.Template(this.app, templates[data.templateId].data);
        const entity = template.instantiate();
        entity.reparent(this.app.root.children[0]);

        if (data.scripts.networkEntity) {
            const networkEntity = entity.script.networkEntity;
            networkEntity.id = data.scripts.networkEntity.id;
            networkEntity.syncInterval = data.scripts.networkEntity.syncInterval;

            this.networkEntities.get(networkEntity.id).entity = entity;
        }

        this.createdEntities.push(data);
        NETWORK.io.to(this.id).emit('entity:create', data);
    }

    getNetworkEntitiesToSync() {
        const networkEntitiesToSync = [];

        this.networkEntities.forEach(networkEntity => {
            if (!networkEntity.isDirty || this.tick % networkEntity.syncInterval != 0)
                return;

            networkEntitiesToSync.push({
                id: networkEntity.id,
                state: networkEntity.state,
            });

            networkEntity.isDirty = false;
        });

        return networkEntitiesToSync;
    }
}
