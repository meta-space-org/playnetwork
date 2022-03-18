# Node


### <a href='./Node.md'>Node</a>  
TODO

### <a href='./Player.md'>Player</a>  
Player is created for each pair of a [User] and a [Room] to which [User] has joined. So [User] will have as many [Player]s as many [Room]s it has joined.

### <a href='./Room.md'>Room</a>  
A Room represents own PlayCanvas [pc.Application] context, with a list of joined [Player]s.

### <a href='./Rooms.md'>Rooms</a>  
Interface with a list of all `PlayNetwork` [Room]s.

### <a href='./User.md'>User</a>  
User interface which is created for each individual connection. User can join multiple rooms, and will have unique [Player] per room.

### <a href='./Users.md'>Users</a>  
Global interface of all [User]s. It provides events when users are connected and disconnected.


[User]: ./User.md  
[Room]: ./Room.md  
[Player]: ./Player.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
