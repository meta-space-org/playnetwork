
<dl>
<dt><a href="#Player">Player</a></dt>
</dl>

Player is created for each pair of a [User](User) and a [Room](Room) to which [User](User) has joined. So [User](User) will have as many [Player](#Player)s as many [Room](Room)s it has joined.
## Functions
<dl>
<dt><a href="#send">send(name, [data])</a></dt>
</dl>


## Properties

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Unique ID of a Player |
| user | <code>User</code> | [User](User) to which this [Player](#Player) belongs. |
| room | <code>Room</code> | [Room](Room) which this [Player](#Player) is created for. |

<a name="Player+event_destroy"></a>
### (event) destroy
Fired when [Player](#Player) has been destroyed.

<a name="send"></a>
## send(name, [data])
Send a named message to a [Player](#Player). So [User](User)on client-side knows with which [Room](Room) this message is associated with.


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

