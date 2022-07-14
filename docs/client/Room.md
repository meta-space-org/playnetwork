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
<a href='#event_*'>*</a> => ([data])  

### Functions

<a href='#function_send'>send(name, [data], [callback])</a>  


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
Latency of this [Room] that takes in account network latency and server application update frequency.



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



<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => ([data])  
Fired when a [Room] received a named network message.

| Param | Type | Description |
| --- | --- | --- |
| data | `null` &#124; `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  


# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data], [callback])</a>  

Send named message to a Room.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `null` &#124; `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | JSON friendly message data. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Callback that will be fired when response message is received. |  



# Callbacks

<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, data)  

| Param | Type | Description |
| --- | --- | --- |
| error | ````null```` &#124; ```[Error]``` | Error provided with with a response. |  
| data | ````null```` &#124; ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data provided with a response. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Room]: ./Room.md  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
