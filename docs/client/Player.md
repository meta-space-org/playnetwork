# Player
extends [pc.EventHandler]

Player represents a pair of joined a [User] and [Room]. So each [User] has as many [Player]s as rooms [Room]s it has joined.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_user'>.user</a> : [User]  
<a href='#property_room'>.room</a> : [Room]  
<a href='#property_mine'>.mine</a> : `boolean`  

### Events

<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_send'>send(name, [data], [callback])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical ID of a [Player].

<a name='property_user'></a>
### <a href='#property_user'>.user</a> : [User]  
[User] that this [Player] belongs to.

<a name='property_room'></a>
### <a href='#property_room'>.room</a> : [Room]  
[Room] that this [Player] associated with.

<a name='property_mine'></a>
### <a href='#property_mine'>.mine</a> : `boolean`  
True if this [Player] belongs to our own [User].



# Events

<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [Player] has been destroyed.



# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data], [callback])</a>  

Send a named message to a [Player].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Data of a message. Must be JSON friendly data. |  
| callback (optional) | `callback` | Response callback, which is called when client receives server response for this specific message. |  



[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Player]: ./Player.md  
[User]: ./User.md  
[Room]: ./Room.md  
