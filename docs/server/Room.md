# Room (server)
extends [pc.EventHandler]

A Room represents own [pc.Application] context, with a list of joined [User]s.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_app'>.app</a> : [pc.Application]  
<a href='#property_users'>.users</a> : [Map]<`number`, [User]>  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  

### Events

<a href='#event_initialize'>initialize</a>  
<a href='#event_join'>join</a> => (user)  
<a href='#event_leave'>leave</a> => (user)  
<a href='#event_error'>error</a> => (error)  
<a href='#event_destroy'>destroy</a>  
<a href='#event_*'>*</a> => (sender, [data], callback)  

### Functions

<a href='#function_send'>send(name, [data])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique ID of a [Room].

<a name='property_app'></a>
### <a href='#property_app'>.app</a> : [pc.Application]  
[pc.Application] associated with a [Room].

<a name='property_users'></a>
### <a href='#property_users'>.users</a> : [Map]<`number`, [User]>  
Map of all joined [User]s where user ID is key.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.



# Events

<a name='event_initialize'></a>
### <a href='#event_initialize'>initialize</a> [event]  
Fired when [Room] has been loaded, initialized, and [pc.Application] started.



<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (user)  
Fired when [User] has joined a [Room].

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (user)  
Fired when [User] has left a [Room].

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Fired when [pc.Application] throws an error. This is a good place to handle gameplay errors.

| Param | Type | Description |
| --- | --- | --- |
| error | [Error] | [Error] object. |  


<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [Room] has been destroyed.



<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => (sender, [data], callback)  
[Room] will receive own named network messages.

| Param | Type | Description |
| --- | --- | --- |
| sender | [User] | [User] that sent the message. |  
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  
| callback | <a href='#callback_messageCallback'>messageCallback</a> | Callback that can be called to indicate that message was handled, or to send [Error]. |  


# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send named message to every [User] in this Room.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | JSON friendly message data. |  



# Callbacks

<a name='callback_messageCallback'></a>
### <a href='#callback_messageCallback'>messageCallback</a> [callback] => ([error], [data])  

| Param | Type | Description |
| --- | --- | --- |
| error (optional) | ```[Error]``` | [Error] object if message is handled incorrectly. |  
| data (optional) | ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data that will be sent to the sender. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Room]: ./Room.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map  
