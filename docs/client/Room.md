# Room (client)
extends [pc.EventHandler]

Room to which [User] has joined.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_tickrate'>.tickrate</a> : `number`  
<a href='#property_root'>.root</a> : [pc.Entity]  
<a href='#property_latency'>.latency</a> : `number`  

### Events

<a href='#event_join'>join</a> => (user)  
<a href='#event_leave'>leave</a> => (user)  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_send'>send(name, [data], [callback])</a>  
<a href='#function_leave'>leave([callback])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical ID.

<a name='property_tickrate'></a>
### <a href='#property_tickrate'>.tickrate</a> : `number`  
Server tickrate of this [Room].

<a name='property_root'></a>
### <a href='#property_root'>.root</a> : [pc.Entity]  
Root [pc.Entity] of this [Room].

<a name='property_latency'></a>
### <a href='#property_latency'>.latency</a> : `number`  
Latency of this [Room] that takes in account our network latency and server application update frequency.



# Events

<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (user)  
Fired when [User] has joined a [Room].

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | [User] that is associated with this [Room]. |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (user)  
Fired when [User] has left a [Room].

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | [User] that was associated with this [Room]. |  


<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [Room] has been destroyed.



# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data], [callback])</a>  

Send a named message to a [Room].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Data of a message. Must be JSON friendly data. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Response callback, which is called when client receives server response for this specific message. |  


<a name='function_leave'></a>
### <a href='#function_leave'>leave([callback])</a>  

Request to leave a room.

| Param | Type | Description |
| --- | --- | --- |
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Response callback, which is called when client receives server response for this specific request. |  



# Callbacks

<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, [data])  

| Param | Type | Description |
| --- | --- | --- |
| error | ```string``` &#124; ```null``` | Response `Error`. |  
| data (optional) | ```object``` &#124; ```array``` &#124; ```string``` &#124; ```number``` &#124; ```boolean``` &#124; ```null``` | Response data. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Room]: ./Room.md  
[User]: ./User.md  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
