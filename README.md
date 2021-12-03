# PlayCanvas Server Boilerplate

This is unofficial boilerplate project for writing multiplayer applications and games with [PlayCanvas engine](https://github.com/playcanvas/engine) running on the back-end.

It also has an [Editor project](https://playcanvas.com/project/857037/overview/playcanvasclientboilerplate) that goes together with this boilerplate, which you can fork.

# Functionality

* **Rooms** - it can run multiple rooms, each with own Application instance, own levels, users and logic.
* **Levels** (hierarchy) - is authored in PlayCanvas Editor, and can be easily sent to back-end to be saved and used for rooms. When client joins a room, server will send correct scene hierarchy and client will instantiate it.
* **Networked entities** - ensures that entities are synchronised between server and clients.
* **Custom events** - allows to send custom events from client/server.
* **Code hot-reloading** - provides faster development times, without a need to restart a server.
* **Interpolation** - client can interpolate vectors, color and quaternions, this is done by attaching `interpolate` script to a networked entity.

### Rooms

Each room has own Application instance and lifecycle. So it can have own scene hierarchy and scripts logic.

### Levels

Server needs to have hierarchy instance, but not assets. And in this boilerplate we simplify things by providing easy "Save Level" button from the [boilerplate client](https://playcanvas.com/project/857037/overview/playcanvasclientboilerplate). Script types can collide between server and client, and don't have to be present on both sides. For example server can implement script type for a button, but client doesn't have to. Although script type should be defined in hierarchy on entity script components.

### Networked entities

Each networked entity get unique unique IDs which is persistent between server and clients. Any server-side change to an entity, components or script attributes, will automatically synchronise to the client.

### Custom events

This boilerplate uses [socket.io](https://socket.io/), which is a popular WebSockets wrapper, that simplifies many things. So server and client can send to each other any variety of messages. As well as server can send message to the whole room that can have many users.

### Code hot-reloading

For faster development times, it is possible to hot-reload script types, without restarting a server (what a blast!). Simply ensure you have `swap` method defined, and internal watcher will try to reload your script on every change/save. This will reload script types from updated file, and trigger `swap` method on all entities with such script type. If there was a parsing error in script type code, it will report that in console and prevent hot-swap.

For more details on how to inherit old instance state read here: [User Manual](https://developer.playcanvas.com/en/user-manual/scripting/hot-reloading/).

# Installation

This boilerplate is made of two projects:

### Server

```bash
git clone git@github.com:meta-space-org/playcanvas-server-boilerplate.git ./server
cd server
npm install
npm run start
```

### Client

1. Go to: https://playcanvas.com/project/857037/overview/playcanvasclientboilerplate
2. Fork the project.
3. Open Editor of forked project.
4. Select "Game" scene.
5. Copy ID from the top of url (e.g. `.../editor/scene/123456` - ID is 123456)
6. Go to "Lobby" scene.
7. Select root entity.
8. On "lobby" script, paste copied ID to "levelId" attribute.
9. Launch the project.
10. Hit "Save Level".
11. Hit "Create Room"
12. Enjoy

To join a room, in connected client room id is accessible from: `LOBBY.roomId`
