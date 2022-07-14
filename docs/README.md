# API Documentation

# Server


### <a href='./server/PlayNetwork.md'>PlayNetwork</a>  
Main interface of PlayNetwork server. This class handles clients connection and communication.

### <a href='./server/NetworkEntity.md'>NetworkEntity</a>  
NetworkEntity is a [pc.ScriptType], which is attached to a [pc.ScriptComponent] of an [pc.Entity] that needs to be synchronised between server and clients. It has unique ID, optional owner and list of properties to be synchronised. For convenience, [pc.Entity] has additional property: `entity.networkEntity`.

### <a href='./server/Room.md'>Room</a>  
A Room represents own [pc.Application] context, with a list of joined [User](./server/User.md)s.

### <a href='./server/Rooms.md'>Rooms</a>  
Interface with a list of server [Room](./server/Room.md)s and an interface to create new rooms.

### <a href='./server/User.md'>User</a>  
User interface which is created for each individual connection and inter-connections to a [PlayNetwork](./server/PlayNetwork.md).

### <a href='./server/Users.md'>Users</a>  
Interface of all [User](./server/User.md)s currently connected to a server. As well as for handling new user authentication.




# Client


### <a href='./client/PlayNetwork.md'>PlayNetwork</a>  
Main interface to connect to a server and interact with networked data.

### <a href='./client/InterpolateValue.md'>InterpolateValue</a>  
Helper class to interpolate values between states. It has mechanics to smoothen unreliable intervals of state and can interpolate simple values such as `number`, as well as complex: [pc.Vec2], [pc.Vec3], [pc.Vec4], [pc.Quat], [pc.Color].

### <a href='./client/Levels.md'>Levels</a>  
Interface that allows to save hierarchy data to a server.

### <a href='./client/NetworkEntity.md'>NetworkEntity</a>  
NetworkEntity is a [pc.ScriptType], which is attached to a [pc.ScriptComponent] of an [pc.Entity] that needs to be synchronised between server and clients. It has unique ID, optional owner and list of properties to be synchronised. For convenience, [pc.Entity] has additional property: `entity.networkEntity`.

### <a href='./client/Room.md'>Room</a>  
Room to which [User](./client/User.md) has joined.

### <a href='./client/User.md'>User</a>  
User object that is created for each [User](./client/User.md) we know, including ourself.



[pc.ScriptType]: https://developer.playcanvas.com/en/api/pc.ScriptType.html  
[pc.ScriptComponent]: https://developer.playcanvas.com/en/api/pc.ScriptComponent.html  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[pc.Vec2]: https://developer.playcanvas.com/en/api/pc.Vec2.html  
[pc.Vec3]: https://developer.playcanvas.com/en/api/pc.Vec3.html  
[pc.Vec4]: https://developer.playcanvas.com/en/api/pc.Vec4.html  
[pc.Quat]: https://developer.playcanvas.com/en/api/pc.Quat.html  
[pc.Color]: https://developer.playcanvas.com/en/api/pc.Color.html  
