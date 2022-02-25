
  
# <a href="#Rooms">Rooms</a>

Interface with a list of all [PlayNetwork] [Room]s.
## Functions
  
<a href="#create">create(levelId, tickrate)</a>  
<a href="#get">get(id)</a> <code>Room</code> | <code>null</code>  
<a href="#has">has(id)</a> <code>boolean</code>

## Events
[create (from, data)](#Rooms+event_create) (event)<br />
[join (user, room)](#Rooms+event_join) (event)<br />
[leave (user, room)](#Rooms+event_leave) (event)<br />

<a name="Rooms+event_create"></a>
### (event) create (from, data)
Fired when [User] has requested room creation, with provided data.[Room] will not be created automatically, it is up to an application logic to decide.


| Param | Type | Description |
| --- | --- | --- |
| from | <code>User</code> | Who have sent a request. |
| data | <code>object</code> | Data of a request. |

<a name="Rooms+event_join"></a>
### (event) join (user, room)
Fired when a [User] requests to join a [Room].[User] will not join automatically, it is up to an application logic to decide.


| Param | Type | Description |
| --- | --- | --- |
| user | <code>User</code> | User who have requested to join a [Room]. |
| room | <code>Room</code> | Room to which a [User] has requested to join. |

<a name="Rooms+event_leave"></a>
### (event) leave (user, room)
Fired when a [User] leaves a [Room].[User] will leave upon a request.


| Param | Type | Description |
| --- | --- | --- |
| user | <code>User</code> | User who have left a [Room]. |
| room | <code>Room</code> | Room from which a [User] has left. |

<a name="create"></a>
## (async) create(levelId, tickrate)
Function to create a new Room.It will load a level by provided ID and start new contextwith a PlayCanvas Application.


| Param | Type | Description |
| --- | --- | --- |
| levelId | <code>number</code> | ID Number of a level. |
| tickrate | <code>number</code> | Tick rate - is how many times Application will be calling `update` in a second. |

<a name="get"></a>
## get(id) ⇒ <code>Room</code> \| <code>null</code>
Get a [Room] by ID.


| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | ID of a [Room]. |

<a name="has"></a>
## has(id) ⇒ <code>boolean</code>
Check a [Room] with a specific ID exists.


| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | ID of a [Room]. |

[PlayNetwork]: ./PlayNetwork.md
[Player]: ./Player.md
[Room]: ./Room.md
[Rooms]: ./Rooms.md
[User]: ./User.md
[Users]: ./Users.md
