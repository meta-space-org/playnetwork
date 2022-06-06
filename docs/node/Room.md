# Room (node)
extends [pc.EventHandler]

A Room represents own PlayCanvas [pc.Application] context, with a list of joined [User]s.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_app'>.app</a> : [pc.Application]  
<a href='#property_users'>.users</a> : [Set]<[User]>  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  

### Events

<a href='#event_initialize'>initialize</a>  
<a href='#event_join'>join</a> => (user)  
<a href='#event_leave'>leave</a> => (user)  
<a href='#event_error'>error</a> => (error)  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_join'>join(user)</a>  
<a href='#function_leave'>leave(user)</a>  
<a href='#function_send'>send(name, [data])</a>  
<a href='#function_getNetworkEntityById'>getNetworkEntityById(id)</a> => [NetworkEntity] &#124; `null`  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique ID of a [Room].

<a name='property_app'></a>
### <a href='#property_app'>.app</a> : [pc.Application]  
PlayCanvas Application associated with a [Room].

<a name='property_users'></a>
### <a href='#property_users'>.users</a> : [Set]<[User]>  
List of all joined [User]s.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.



# Events

<a name='event_initialize'></a>
### <a href='#event_initialize'>initialize</a> [event]  
Fired when [Room] has been loaded and initialized, With PlayCanvas Application started.



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

| Param | Type |
| --- | --- |
| error | `Error` |  


<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [Room] has been destroyed.



# Functions

<a name='function_join'></a>
### <a href='#function_join'>join(user)</a>  

Join a [User] to a [Room]. Upon joining,

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='function_leave'></a>
### <a href='#function_leave'>leave(user)</a>  

Remove (leave) a [User] from a [Room]. and remaining [Room] members will be notified.

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send named message to every [User] in this Room.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional message data. Must be JSON friendly data. |  


<a name='function_getNetworkEntityById'></a>
### <a href='#function_getNetworkEntityById'>getNetworkEntityById(id)</a>  
  
**Returns:** [NetworkEntity] | `null`  
Get [NetworkEntity] of a [Room] by ID.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [NetworkEntity]. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Room]: ./Room.md  
[NetworkEntity]: ./NetworkEntity.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
