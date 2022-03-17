# API Documentation

# Server


### <a href='./server/PlayNetwork.md'>PlayNetwork</a>  
Main interface of PlayNetwork, which provides access to all process [User](./server/User.md)s and [Room](./server/Room.md)s.

### <a href='./server/Player.md'>Player</a>  
Player is created for each pair of a [User](./server/User.md) and a [Room](./server/Room.md) to which [User](./server/User.md) has joined. So [User](./server/User.md) will have as many [Player](./server/Player.md)s as many [Room](./server/Room.md)s it has joined.

### <a href='./server/Room.md'>Room</a>  
A Room represents own PlayCanvas [pc.Application] context, with a list of joined [Player](./server/Player.md)s.

### <a href='./server/Rooms.md'>Rooms</a>  
Interface with a list of all [PlayNetwork](./server/PlayNetwork.md) [Room](./server/Room.md)s.

### <a href='./server/User.md'>User</a>  
User interface which is created for each individual connection. User can join multiple rooms, and will have unique [Player](./server/Player.md) per room.

### <a href='./server/Users.md'>Users</a>  
Global interface of all [User](./server/User.md)s. It provides events when users are connected and disconnected.




# Client


### <a href='./client/PlayNetwork.md'>PlayNetwork</a>  
Main interface to connect to a server and interact with networked data.

### <a href='./client/InterpolateValue.md'>InterpolateValue</a>  
Helper class to interpolate values between states. It has mechanics to smoothen unreliable intervals of state and can interpolate simple values such as `number`, as well as complex: [pc.Vec2], [pc.Vec3], [pc.Vec4], [pc.Quat], [pc.Color].

### <a href='./client/Performance.md'>Performance</a>  
Helper class to collect performance data.

### <a href='./client/Player.md'>Player</a>  
Player represents a pair of joined a [User](./client/User.md) and [Room](./client/Room.md). So each [User](./client/User.md) has as many [Player](./client/Player.md)s as rooms [Room](./client/Room.md)s it has joined.

### <a href='./client/Room.md'>Room</a>  
Room to which [User](./client/User.md) has joined.

### <a href='./client/Rooms.md'>Rooms</a>  
Interface to get [Room](./client/Room.md)s as well as request a [Room](./client/Room.md) create, join and leave.

### <a href='./client/User.md'>User</a>  
User object that is created for each [User](./client/User.md) we know, including ourself.

### <a href='./client/Users.md'>Users</a>  
Interface to access all known [User](./client/User.md)s as well as own user (`me`).



[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[pc.Vec2]: https://developer.playcanvas.com/en/api/pc.Vec2.html  
[pc.Vec3]: https://developer.playcanvas.com/en/api/pc.Vec3.html  
[pc.Vec4]: https://developer.playcanvas.com/en/api/pc.Vec4.html  
[pc.Quat]: https://developer.playcanvas.com/en/api/pc.Quat.html  
[pc.Color]: https://developer.playcanvas.com/en/api/pc.Color.html  
