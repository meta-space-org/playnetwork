# User
extends [pc.EventHandler]

User object that is created for each [User] we know, including ourself.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_rooms'>.rooms</a> : Set([Room]);  
<a href='#property_players'>.players</a> : Set([Player]);  
<a href='#property_me'>.me</a> : `boolean`  

### Events

<a href='#event_join'>join</a> => (room, player)  
<a href='#event_leave'>leave</a> => (room, player)  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_getPlayerByRoom'>getPlayerByRoom(room)</a> => [Player] &#124; `null`  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical ID of a [User].

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : Set([Room]);  
List of [Room]s that [User] has joined to.

<a name='property_players'></a>
### <a href='#property_players'>.players</a> : Set([Player]);  
List of [Player]s that is associated with this [User] and joined [Room]s.

<a name='property_me'></a>
### <a href='#property_me'>.me</a> : `boolean`  
True if [User] object is our own.



# Events

<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (room, player)  
Fired when [User] has joined a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | To which [User] has joined. |  
| player | [Player] | [Player] object that is created for this [User] - [Room] pair. |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (room, player)  
Fired when a [User] left a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | From which [User] has left. |  
| player | [Player] | [Player] object that was associated with that [User] and a [Room]. |  


<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [User] has been destroyed (not known to client anymore).



# Functions

<a name='function_getPlayerByRoom'></a>
### <a href='#function_getPlayerByRoom'>getPlayerByRoom(room)</a>  
  
**Returns:** [Player] | `null`  
Get [Player] object of this [User] by [Room].

| Param | Type |
| --- | --- |
| room | [Room] |  



[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Player]: ./Player.md  
[User]: ./User.md  
[Room]: ./Room.md  

