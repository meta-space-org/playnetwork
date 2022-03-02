# Room
extends [pc.EventHandler]

A Room represents own PlayCanvas [pc.Application] context, with a list of joined [Player]s.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_app'>.app</a> : [pc.Application]  
<a href='#property_players'>.players</a> : [Set]<[Player]>;  

### Events

<a href='#event_initialize'>initialize</a>  
<a href='#event_join'>join</a>  
<a href='#event_leave'>leave</a>  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_join'>join(user)</a>  
<a href='#function_leave'>leave(user)</a>  
<a href='#function_send'>send(name, [data])</a>  
<a href='#function_getPlayerById'>getPlayerById(id)</a> => [Player] &#124; `null`  
<a href='#function_getPlayerByUser'>getPlayerByUser(user)</a> => [Player] &#124; `null`  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique ID of a [Room].

<a name='property_app'></a>
### <a href='#property_app'>.app</a> : [pc.Application]  
PlayCanvas Application associated with a [Room].

<a name='property_players'></a>
### <a href='#property_players'>.players</a> : [Set]<[Player]>;  
List of all joined [Player]s. Each [User] has one [Player] which lifetime is associated with this [Room].



# Events

<a name='event_initialize'></a>
### <a href='#event_initialize'>initialize</a> [event]  
Fired when [Room] has been loaded and initialized, With PlayCanvas Application started.



<a name='event_join'></a>
### <a href='#event_join'>join</a> [event]  
Fired when [Player] has joined a [Room].



<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event]  
Fired when [Player] has left a [Room].



<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [Room] has been destroyed.



# Functions

<a name='function_join'></a>
### <a href='#function_join'>join(user)</a>  

Join a [User] to a [Room]. Upon joining, new [Player] instance will be created for this specific [Room].

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='function_leave'></a>
### <a href='#function_leave'>leave(user)</a>  

Remove (leave) a [User] from a [Room]. Related [Player] instances will be destroyed and remaining [Room] members will be notified.

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send named message to every [Player] in a [Room].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional message data. Must be JSON friendly data. |  


<a name='function_getPlayerById'></a>
### <a href='#function_getPlayerById'>getPlayerById(id)</a>  
  
**Returns:** [Player] | `null`  
Get [Player] of a [Room] by ID.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [Player]. |  


<a name='function_getPlayerByUser'></a>
### <a href='#function_getPlayerByUser'>getPlayerByUser(user)</a>  
  
**Returns:** [Player] | `null`  
Get [Player] of a [Room] by [User].

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | [User] which is a member of this [Room]. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Room]: ./Room.md  
[Player]: ./Player.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
