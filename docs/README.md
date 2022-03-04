# API Documentation

# Server


### <a href='./server/PlayNetwork.md'>PlayNetwork</a>  
Main interface of PlayNetwork, which provides access to all process [User]s and [Room]s.

### <a href='./server/Player.md'>Player</a>  
Player is created for each pair of a [User] and a [Room] to which [User] has joined. So [User] will have as many [Player]s as many [Room]s it has joined.

### <a href='./server/Room.md'>Room</a>  
A Room represents own PlayCanvas [pc.Application] context, with a list of joined [Player]s.

### <a href='./server/Rooms.md'>Rooms</a>  
Interface with a list of all [PlayNetwork] [Room]s.

### <a href='./server/User.md'>User</a>  
User interface which is created for each individual connection. User can join multiple rooms, and will have unique [Player] per room.

### <a href='./server/Users.md'>Users</a>  
Global interface of all [User]s. It provides events when users are connected and disconnected.


[User]: ./server/User.md  
[Room]: ./server/Room.md  
[Player]: ./server/Player.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[PlayNetwork]: ./server/PlayNetwork.md  


# Client


### <a href='./client/PlayNetwork.md'>PlayNetwork</a>  
Main interface to connect to a server and interact with networked data.

### <a href='./client/InterpolateValue.md'>InterpolateValue</a>  
Helper class to interpolate values between states. It has mechanics to smoothen unreliable intervals of state and can interpolate simple values such as `number`, as well as complex: [pc.Vec2], [pc.Vec3], [pc.Vec4], [pc.Quat], [pc.Color].

### <a href='./client/Player.md'>Player</a>  
Player represents a pair of joined a [User] and [Room]. So each [User] has as many [Player]s as rooms [Room]s it has joined.

### <a href='./client/Room.md'>Room</a>  
Room to which [User] has joined.

### <a href='./client/Rooms.md'>Rooms</a>  
Interface to get [Room]s as well as request a [Room] create, join and leave.

### <a href='./client/User.md'>User</a>  
User object that is created for each [User] we know, including ourself.

### <a href='./client/Users.md'>Users</a>  
Interface to access all known [User]s as well as own user (`me`).


[pc.Vec2]: https://developer.playcanvas.com/en/api/pc.Vec2.html  
[pc.Vec3]: https://developer.playcanvas.com/en/api/pc.Vec3.html  
[pc.Vec4]: https://developer.playcanvas.com/en/api/pc.Vec4.html  
[pc.Quat]: https://developer.playcanvas.com/en/api/pc.Quat.html  
[pc.Color]: https://developer.playcanvas.com/en/api/pc.Color.html  
[User]: ./client/User.md  
[Room]: ./client/Room.md  
[Player]: ./client/Player.md  
