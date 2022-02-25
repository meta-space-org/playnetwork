# Server Docs

## Classes

* [PlayNetwork]  Main interface of PlayNetwork, which provides access.
* [Player]  Player is created for each pair of a [User] and a [Room]to which [User] has joined. So [User] will have as many [Player]sas many [Room]s it has joined.
* [Room]  A Room represents own PlayCanvas Application context,with a list of joined [Player]s.
* [Rooms]  Interface with a list of all [PlayNetwork] [Room]s.
* [User]  User interface which is created for each individual connection.User can join multiple rooms, and will have unique [Player] per room.
* [Users]  Global interface of all [User]s.It provides events when users are connected and disconnected.

[PlayNetwork]: ./PlayNetwork.md
[Player]: ./Player.md
[Room]: ./Room.md
[Rooms]: ./Rooms.md
[User]: ./User.md
[Users]: ./Users.md
