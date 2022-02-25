## Server Docs

#### Classes:

* [PlayNetwork](./PlayNetwork.md)  Main interface of PlayNetwork, which provides access.
* [Player](./Player.md)  Player is created for each pair of a {@link User} and a {@link Room}to which {@link User} has joined. So {@link User} will have as many {@link Player}sas many {@link Room}s it has joined.
* [Room](./Room.md)  A Room represents own PlayCanvas Application context,with a list of joined {@link Player}s.
* [Rooms](./Rooms.md)  Interface with a list of all {@link PlayNetwork} {@link Room}s.
* [User](./User.md)  User interface which is created for each individual connection.User can join multiple rooms, and will have unique {@link Player} per room.
* [Users](./Users.md)  Global interface of all {@link User}s.It provides events when users are connected and disconnected.
