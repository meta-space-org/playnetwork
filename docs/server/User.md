# User (server)
extends [pc.EventHandler]

User interface which is created for each individual connection and inter-connections to a [PlayNetwork].

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number` &#124; `string`  
<a href='#property_room'>.room</a> : `null` &#124; [Room]  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
<a href='#property_latency'>.latency</a> : `number`  

### Events

<a href='#event_join'>join</a> => (room)  
<a href='#event_leave'>leave</a> => (room)  
<a href='#event_destroy'>destroy</a>  
<a href='#event_*'>*</a> => (sender, [data], callback)  

### Functions

<a href='#function_join'>join(roomId)</a> [async] => `null` &#124; [Error]  
<a href='#function_leave'>leave()</a> [async] => `null` &#124; [Error]  
<a href='#function_send'>send(name, [data])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number` &#124; `string`  
Unique identifier for the user.

<a name='property_room'></a>
### <a href='#property_room'>.room</a> : `null` &#124; [Room]  
[Room] that [User] is currently joined to.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.

<a name='property_latency'></a>
### <a href='#property_latency'>.latency</a> : `number`  
Latency of the connection in milliseconds.



# Events

<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (room)  
Fired when [User] is joined to a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | [Room] that [User] is joined. |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (room)  
Fired when [User] left [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | [Room] that [User] left. |  


<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired after disconnect and related data is destroyed.



<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => (sender, [data], callback)  
[User] will receive own named network messages.

| Param | Type | Description |
| --- | --- | --- |
| sender | [User] | [User] that sent the message. |  
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  
| callback | <a href='#callback_responseCallback'>responseCallback</a> | Callback that can be called to respond to a message. |  


# Functions

<a name='function_join'></a>
### <a href='#function_join'>join(roomId)</a> [async]  
  
**Returns:** `null` | [Error]  
Join to a [Room].

| Param | Type | Description |
| --- | --- | --- |
| roomId | `number` | ID of the [Room] to join. |  


<a name='function_leave'></a>
### <a href='#function_leave'>leave()</a> [async]  
  
**Returns:** `null` | [Error]  
Leave a [Room] to which is currently joined.



<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send a named message to a [User].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | JSON friendly message data. |  



# Callbacks

<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, data)  

| Param | Type | Description |
| --- | --- | --- |
| error | ````null```` &#124; ```[Error]``` | Error provided with a response. |  
| data | ````null```` &#124; ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data provided with a response. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Room]: ./Room.md  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
[User]: ./User.md  
[PlayNetwork]: ./PlayNetwork.md  
