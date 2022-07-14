# Server


### <a href='./PlayNetwork.md'>PlayNetwork</a>  
Main interface of PlayNetwork server. This class handles clients connection and communication.

### <a href='./NetworkEntity.md'>NetworkEntity</a>  
NetworkEntity is a [pc.ScriptType], which is attached to a [pc.ScriptComponent] of an [pc.Entity] that needs to be synchronised between server and clients. It has unique ID, optional owner and list of properties to be synchronised. For convenience, [pc.Entity] has additional property: `entity.networkEntity`.

### <a href='./Room.md'>Room</a>  
A Room represents own [pc.Application] context, with a list of joined [User]s.

### <a href='./Rooms.md'>Rooms</a>  
Interface with a list of server [Room]s and an interface to create new rooms.

### <a href='./User.md'>User</a>  
User interface which is created for each individual connection and inter-connections to a [PlayNetwork].

### <a href='./Users.md'>Users</a>  
Interface of all [User]s currently connected to a server. As well as for handling new user authentication.


[pc.ScriptType]: https://developer.playcanvas.com/en/api/pc.ScriptType.html  
[pc.ScriptComponent]: https://developer.playcanvas.com/en/api/pc.ScriptComponent.html  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[User]: ./User.md  
[Room]: ./Room.md  
[PlayNetwork]: ./PlayNetwork.md  
