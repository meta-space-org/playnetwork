# Node


### <a href='./Node.md'>Node</a>  
Each `WorkerNode` creates a worker process and instantiates a [Node], which is running in own thread on a single core. `PlayNetwork` creates multiple `WorkerNode`s to utilize all available CPUs of a server. [Node] handles multiple [User]s and [Room]s.

### <a href='./Player.md'>Player</a>  
Player is created for each pair of a [User] and a [Room] to which [User] has joined. So [User] will have as many [Player]s as many [Room]s it has joined.

### <a href='./Room.md'>Room</a>  
A Room represents own PlayCanvas [pc.Application] context, with a list of joined [Player]s.

### <a href='./Rooms.md'>Rooms</a>  
Interface with a list of all [Node] [Room]s. Client can send a room creation and join request, it is up to application logic to handle those requests and call create/join.

### <a href='./User.md'>User</a>  
User interface which is created for each individual connection from `PlayNetwork` to a [Node]. User can join multiple rooms, and will have unique [Player] per room.

### <a href='./Users.md'>Users</a>  
Interface of all [User]s, currently connected to a [Node]. It provides events when users are connected and disconnected.

### <a href='./NetworkEntity.md'>NetworkEntity</a>  
NetworkEntity is a [pc.ScriptType], which is attached to a [pc.ScriptComponent] of an [pc.Entity] that needs to be synchronised between server and clients. It has unique ID, optional owner and list of properties to be synchronised.


[Node]: ./Node.md  
[User]: ./User.md  
[Room]: ./Room.md  
[Player]: ./Player.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[pc.ScriptType]: https://developer.playcanvas.com/en/api/pc.ScriptType.html  
[pc.ScriptComponent]: https://developer.playcanvas.com/en/api/pc.ScriptComponent.html  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
