
<dl>
<dt><a href="#User">User</a></dt>
</dl>

User interface which is created for each individual connection. User can join multiple rooms, and will have unique [Player](Player) per room.
## Functions
<dl>
<dt><a href="#send">send(name, [data])</a></dt>
<dt><a href="#getPlayerByRoom">getPlayerByRoom(room)</a> <code>Player</code> | <code>null</code></dt>
<dt><a href="#disconnect">disconnect()</a></dt>
</dl>


## Properties

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Unique identifier per connection. |
| rooms | <code>Set.&lt;Room&gt;</code> | List of [Room](Room)s that user has joined. |
| players | <code>Set.&lt;Player&gt;</code> | List of [Player](Player)s belonging to a user, one [Player](Player) per [Room](Room). |


## Events
[disconnect](#User+event_disconnect) (event)<br />
[destroy](#User+event_destroy) (event)<br />

<a name="User+event_disconnect"></a>
### (event) disconnect
Fired when user gets disconnected,before all related data is destroyed.

<a name="User+event_destroy"></a>
### (event) destroy
Fired after disconnect and related data is destroyed.

<a name="send"></a>
## send(name, [data])
Send a named message to a [User](#User).


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a message. |
| [data] | <code>object</code> \| <code>array</code> \| <code>string</code> \| <code>number</code> \| <code>boolean</code> | Optional message data. Must be JSON friendly data. |

<a name="getPlayerByRoom"></a>
## getPlayerByRoom(room) ⇒ <code>Player</code> \| <code>null</code>
Get [Player](Player) of a [User](#User) by [Room](Room).

**Returns**: <code>Player</code> \| <code>null</code> - Player related to a specific [Room](Room)and this [User](#User)  

| Param | Type | Description |
| --- | --- | --- |
| room | <code>Room</code> | [Room](Room) of which this [User](#User) is a member. |

<a name="disconnect"></a>
## disconnect()
Force disconnect a [User](#User).

[PlayNetwork]: ./PlayNetwork.md

[Player]: ./Player.md

[Room]: ./Room.md

[Rooms]: ./Rooms.md

[User]: ./User.md

[Users]: ./Users.md

