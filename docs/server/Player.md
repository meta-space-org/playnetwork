# Player (server)
extends [pc.EventHandler]

Player is created for each pair of a [User] and a [Room] to which [User] has joined. So [User] will have as many [Player]s as many [Room]s it has joined.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_user'>.user</a> : [User]  
<a href='#property_room'>.room</a> : [Room]  

### Events

<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_send'>send(name, [data])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique ID of a Player

<a name='property_user'></a>
### <a href='#property_user'>.user</a> : [User]  
[User] to which this [Player] belongs.

<a name='property_room'></a>
### <a href='#property_room'>.room</a> : [Room]  
[Room] which this [Player] is created for.



# Events

<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [Player] has been destroyed.



# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send a named message to a [Player]. So [User] on client-side knows with which [Room] this message is associated with.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional message data. Must be JSON friendly data. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Player]: ./Player.md  
[User]: ./User.md  
[Room]: ./Room.md  
