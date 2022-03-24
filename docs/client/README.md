# Client


### <a href='./PlayNetwork.md'>PlayNetwork</a>  
Main interface to connect to a server and interact with networked data.

### <a href='./InterpolateValue.md'>InterpolateValue</a>  
Helper class to interpolate values between states. It has mechanics to smoothen unreliable intervals of state and can interpolate simple values such as `number`, as well as complex: [pc.Vec2], [pc.Vec3], [pc.Vec4], [pc.Quat], [pc.Color].

### <a href='./Levels.md'>Levels</a>  
Interface that allows to save hierarchy data to a server.

### <a href='./Player.md'>Player</a>  
Player represents a pair of joined a [User] and [Room]. So each [User] has as many [Player]s as rooms [Room]s it has joined.

### <a href='./Room.md'>Room</a>  
Room to which [User] has joined.

### <a href='./Rooms.md'>Rooms</a>  
Interface to get [Room]s as well as request a [Room] create, join and leave.

### <a href='./User.md'>User</a>  
User object that is created for each [User] we know, including ourself.

### <a href='./Users.md'>Users</a>  
Interface to access all known [User]s as well as own user (`me`).


[pc.Vec2]: https://developer.playcanvas.com/en/api/pc.Vec2.html  
[pc.Vec3]: https://developer.playcanvas.com/en/api/pc.Vec3.html  
[pc.Vec4]: https://developer.playcanvas.com/en/api/pc.Vec4.html  
[pc.Quat]: https://developer.playcanvas.com/en/api/pc.Quat.html  
[pc.Color]: https://developer.playcanvas.com/en/api/pc.Color.html  
[User]: ./User.md  
[Room]: ./Room.md  
[Player]: ./Player.md  
