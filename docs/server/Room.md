
<dl>
<dt><a href="#Room">Room</a></dt>
</dl>

A Room represents own PlayCanvas Application context, with a list of joined [Player](Player)s.
## Functions
<dl>
<dt><a href="#join">join(user)</a></dt>
<dt><a href="#leave">leave(user)</a></dt>
<dt><a href="#send">send(name, [data])</a></dt>
<dt><a href="#getPlayerById">getPlayerById(id)</a> <code>Player</code> | <code>null</code></dt>
<dt><a href="#getPlayerByUser">getPlayerByUser(user)</a> <code>Player</code> | <code>null</code></dt>
</dl>


## Properties

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Unique ID of a [Room](#Room). |
| app | <code>pc.Application</code> | PlayCanvas Application associated with a [Room](#Room). |
| players | <code>Set.&lt;Player&gt;</code> | List of all joined [Player](Player)s. Each [User](User) has one [Player](Player) which lifetime is associated with this [Room](#Room). |


## Events
[initialize](#Room+event_initialize) (event)<br />
[join](#Room+event_join) (event)<br />
[leave](#Room+event_leave) (event)<br />
[destroy](#Room+event_destroy) (event)<br />

<a name="Room+event_initialize"></a>
### (event) initialize
Fired when [Room](#Room) has been loaded and initialized,With PlayCanvas Application started.

<a name="Room+event_join"></a>
### (event) join
Fired when [Player](Player) has joined a [Room](#Room).

## Properties

| Name | Type |
| --- | --- |
| player | <code>Player</code> | 

<a name="Room+event_leave"></a>
### (event) leave
Fired when [Player](Player) has left a [Room](#Room).

## Properties

| Name | Type |
| --- | --- |
| player | <code>Player</code> | 

<a name="Room+event_destroy"></a>
### (event) destroy
Fired when [Room](#Room) has been destroyed.

<a name="join"></a>
## join(user)
Join a [User](User) to a [Room](#Room). Upon joining,new [Player](Player) instance will be created for this specific [Room](#Room).


| Param | Type |
| --- | --- |
| user | <code>User</code> | 

<a name="leave"></a>
## leave(user)
Remove (leave) a [User](User) from a [Room](#Room).Related [Player](Player) instances will be destroyedand remaining [Room](#Room) members will be notified.


| Param | Type |
| --- | --- |
| user | <code>User</code> | 

<a name="send"></a>
## send(name, [data])
Send named message to every [Player](Player) in a [Room](#Room).


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a message. |
| [data] | <code>object</code> \| <code>array</code> \| <code>string</code> \| <code>number</code> \| <code>boolean</code> | Optional message data. Must be JSON friendly data. |

<a name="getPlayerById"></a>
## getPlayerById(id) ⇒ <code>Player</code> \| <code>null</code>
Get [Player](Player) of a [Room](#Room) by ID.

**Returns**: <code>Player</code> \| <code>null</code> - Player related to a specific [User](User)and this [Room](#Room)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | ID of a [Player](Player). |

<a name="getPlayerByUser"></a>
## getPlayerByUser(user) ⇒ <code>Player</code> \| <code>null</code>
Get [Player](Player) of a [Room](#Room) by [User](User).

**Returns**: <code>Player</code> \| <code>null</code> - Player related to a specific [User](User)and this [Room](#Room)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>User</code> | [User](User) which is a member of this [Room](#Room). |

[PlayNetwork]: ./PlayNetwork.md

[Player]: ./Player.md

[Room]: ./Room.md

[Rooms]: ./Rooms.md

[User]: ./User.md

[Users]: ./Users.md

