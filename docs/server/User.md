
  
# <a href="#User">User</a>

User interface which is created for each individual connection. User can join multiple rooms, and will have unique [Player] per room.
## Functions
  
<a href="#send">send(name, [data])</a>  
<a href="#getPlayerByRoom">getPlayerByRoom(room)</a> <code>Player</code> | <code>null</code>  
<a href="#disconnect">disconnect()</a>
## Properties

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Unique identifier per connection. |
| rooms | <code>Set.&lt;Room&gt;</code> | List of [Room]s that user has joined. |
| players | <code>Set.&lt;Player&gt;</code> | List of [Player]s belonging to a user, one [Player] per [Room]. |


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
Send a named message to a [User].


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a message. |
| [data] | <code>object</code> \| <code>array</code> \| <code>string</code> \| <code>number</code> \| <code>boolean</code> | Optional message data. Must be JSON friendly data. |

<a name="getPlayerByRoom"></a>
## getPlayerByRoom(room) ⇒ <code>Player</code> \| <code>null</code>
Get [Player] of a [User] by [Room].

**Returns**: <code>Player</code> \| <code>null</code> - Player related to a specific [Room]and this [User]  

| Param | Type | Description |
| --- | --- | --- |
| room | <code>Room</code> | [Room] of which this [User] is a member. |

<a name="disconnect"></a>
## disconnect()
Force disconnect a [User].

[PlayNetwork]: ./PlayNetwork.md
[Player]: ./Player.md
[Room]: ./Room.md
[Rooms]: ./Rooms.md
[User]: ./User.md
[Users]: ./Users.md
