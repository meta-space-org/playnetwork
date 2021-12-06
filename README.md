# PlayCanvas Server Boilerplate

This is unofficial boilerplate project for starting your multiplayer project with [PlayCanvas engine](https://github.com/playcanvas/engine) running on the server and the client.

It also has an [Editor project](https://playcanvas.com/project/857037/overview/playcanvasclientboilerplate) that goes together with this boilerplate, which you can fork.

# Demo

(coming soon)

# Functionality

* **Rooms** - it can run multiple rooms, each with own Application instance, own levels, users and logic.
* **Levels** (hierarchy) - is authored in PlayCanvas Editor, and can be easily sent to back-end to be saved and used for rooms. When client joins a room, server will send correct scene hierarchy and client will instantiate it.
* **Networked entities** - ensures that entities are synchronised between server and clients. Using `properties` list, you can specify (by path) what data is synchronised.
* **Custom events** - allows to send custom events from client/server.
* **Code hot-reloading** - provides faster development times, without a need to restart a server.
* **Interpolation** - client can interpolate vectors, colors and quaternions, this is done by specifying `interpolate` paths on a networked entity.

### Rooms

Each room has own Application instance and lifecycle. So it can have own scene hierarchy and scripts logic.

### Levels

Server needs to have hierarchy instance, but not assets. And in this boilerplate we simplify things by providing easy "Save Level" button from the [boilerplate client](https://playcanvas.com/project/857037/overview/playcanvasclientboilerplate). Script types can collide between server and client, and don't have to be present on client, but should be on server, with correct attributes. For example server can implement script type for a button, but client doesn't have to. Logic of the scripts will differ between client and server for the same scripts.

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
2. Fork the project
3. Open Editor of forked project
4. Select "Lobby" scene
5. Launch the project
6. Hit "Create Room"
7. Enjoy

To join, open another tab with launched game, and use Room ID for joining.

# Debugging

You can run server with a debugger: `npm run debug`, then open Chrome, and navigate to `chrome://inspect`, and then click on `Open dedicated DevTools for Node`.

You can use breakpoints and debug the same way as client side pages.


### Level Data

Level (hierarchy) is stored on the server, and is sent to client when it connectes to the room. For demo purposes, you can use "Save Level" button while using Launcher, it will load scene hierarchy, and send to server. For demo purposes we save it to the file, but database could be a better fit.

In order to find scene ID:

1. Go to your project in Editor
2. Select Scene you want to save
3. Copy ID from the top of url (e.g. `.../editor/scene/123456` - ID is 123456)
4. Go to "Lobby" scene
5. Select root entity
6. On "lobby" script, paste copied ID to "levelId" attribute
7. Launch the project
8. Hit "Save Level"


### Templates

It is convenient to use Templates on the server, in order to create complex entities. This boilerplate automatically parses and loads templates from `./src/templates` directory. You can then access them as normal by ID: `this.app.assets.get(61886320)`. And instantiate.

All templates are sent to the client from the server on load. So client can use server hosted templates too.

In order to get Template JSON file, unfortunately it is not implemented in Editor yet: https://github.com/playcanvas/editor/issues/551
So we can use Editor API in order to get JSON:

1. Open Editor
2. Select single Template asset
3. Open Dev Tools > Console
4. Execute in console: `JSON.stringify(editor.call('selector:items')[0].json(), null, 4)`;
5. Right-click on logged string > Copy string contents
6. Paste copied JSON into `./src/templates/template.json` - your template file

Then use that template ID to get it from registry.
