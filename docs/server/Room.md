
# <a href="#Room">Room</a>

A Room represents own PlayCanvas Application context, with a list of joined [Player]s.
## Functions
<a href="#join">join(user)</a><a href="#leave">leave(user)</a><a href="#send">send(name, [data])</a><a href="#getPlayerById">getPlayerById(id)</a> <code>Player</code> | <code>null</code><a href="#getPlayerByUser">getPlayerByUser(user)</a> <code>Player</code> | <code>null</code>
## Properties

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Unique ID of a [Room]. |
| app | <code>pc.Application</code> | PlayCanvas Application associated with a [Room]. |
| players | <code>Set.&lt;Player&gt;</code> | List of all joined [Player]s. Each [User] has one [Player] which lifetime is associated with this [Room]. |


## Events
[initialize](#Room+event_initialize) (event)<br />
[join](#Room+event_join) (event)<br />
[leave](#Room+event_leave) (event)<br />
[destroy](#Room+event_destroy) (event)<br />

<a name="Room+event_initialize"></a>
### (event) initialize
Fired when [Room] has been loaded and initialized,With PlayCanvas Application started.

<a name="Room+event_join"></a>
### (event) join
Fired when [Player] has joined a [Room].

## Properties

| Name | Type |
| --- | --- |
| player | <code>Player</code> | 

<a name="Room+event_leave"></a>
### (event) leave
Fired when [Player] has left a [Room].

## Properties

| Name | Type |
| --- | --- |
| player | <code>Player</code> | 

<a name="Room+event_destroy"></a>
### (event) destroy
Fired when [Room] has been destroyed.

<a name="join"></a>
## join(user)
Join a [User] to a [Room]. Upon joining,new [Player] instance will be created for this specific [Room].


| Param | Type |
| --- | --- |
| user | <code>User</code> | 

<a name="leave"></a>
## leave(user)
Remove (leave) a [User] from a [Room].Related [Player] instances will be destroyedand remaining [Room] members will be notified.


| Param | Type |
| --- | --- |
| user | <code>User</code> | 

<a name="send"></a>
## send(name, [data])
Send named message to every [Player] in a [Room].


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a message. |
| [data] | <code>object</code> \| <code>array</code> \| <code>string</code> \| <code>number</code> \| <code>boolean</code> | Optional message data. Must be JSON friendly data. |

<a name="getPlayerById"></a>
## getPlayerById(id) ⇒ <code>Player</code> \| <code>null</code>
Get [Player] of a [Room] by ID.

**Returns**: <code>Player</code> \| <code>null</code> - Player related to a specific [User]and this [Room]  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | ID of a [Player]. |

<a name="getPlayerByUser"></a>
## getPlayerByUser(user) ⇒ <code>Player</code> \| <code>null</code>
Get [Player] of a [Room] by [User].

**Returns**: <code>Player</code> \| <code>null</code> - Player related to a specific [User]and this [Room]  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>User</code> | [User] which is a member of this [Room]. |

[PlayNetwork]: ./PlayNetwork.md
[Player]: ./Player.md
[Room]: ./Room.md
[Rooms]: ./Rooms.md
[User]: ./User.md
[Users]: ./Users.md
