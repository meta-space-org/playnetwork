
# <a href="#Player">Player</a>

Player is created for each pair of a [User] and a [Room] to which [User] has joined. So [User] will have as many [Player]s as many [Room]s it has joined.
## Functions
<a href="#send">send(name, [data])</a>
## Properties

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Unique ID of a Player |
| user | <code>User</code> | [User] to which this [Player] belongs. |
| room | <code>Room</code> | [Room] which this [Player] is created for. |

<a name="Player+event_destroy"></a>
### (event) destroy
Fired when [Player] has been destroyed.

<a name="send"></a>
## send(name, [data])
Send a named message to a [Player]. So [User]on client-side knows with which [Room] this message is associated with.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a message. |
| [data] | <code>object</code> \| <code>array</code> \| <code>string</code> \| <code>number</code> \| <code>boolean</code> | Optional message data. Must be JSON friendly data. |

[PlayNetwork]: ./PlayNetwork.md
[Player]: ./Player.md
[Room]: ./Room.md
[Rooms]: ./Rooms.md
[User]: ./User.md
[Users]: ./Users.md
