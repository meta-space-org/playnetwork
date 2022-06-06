# User (node)
extends [pc.EventHandler]

User interface which is created for each individual connection from `PlayNetwork` to a [Node]. User can join multiple rooms

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_rooms'>.rooms</a> : [Set]<[Room]>  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  

### Events

<a href='#event_disconnect'>disconnect</a>  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_send'>send(name, [data])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique identifier per connection, same as `Client` ID.

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : [Set]<[Room]>  
List of [Room]s that user has joined.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.



# Events

<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event]  
Fired when user gets disconnected, before all related data is destroyed.



<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired after disconnect and related data is destroyed.



# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send a named message to a [User].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional message data. Must be JSON friendly data. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Node]: ./Node.md  
[Room]: ./Room.md  
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
