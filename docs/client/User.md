# User (client)
extends [pc.EventHandler]

User object that is created for each [User] we know, including ourself.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_mine'>.mine</a> : `boolean`  

### Events

<a href='#event_destroy'>destroy</a>  
<a href='#event_*'>*</a> => ([data])  

### Functions

<a href='#function_send'>send(name, [data], [callback])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical ID of a [User].

<a name='property_mine'></a>
### <a href='#property_mine'>.mine</a> : `boolean`  
True if [User] object is our own.



# Events

<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [User] has been destroyed (not known to client anymore).



<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => ([data])  
[User] will receive own named network messages.

| Param | Type | Description |
| --- | --- | --- |
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  


# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data], [callback])</a>  

Send named message to a server User.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | JSON friendly message data. |  
| callback (optional) | <a href='#callback_messageCallback'>messageCallback</a> | Callback that will be fired when response is received or on error. |  



# Callbacks

<a name='callback_messageCallback'></a>
### <a href='#callback_messageCallback'>messageCallback</a> [callback] => ([error], [data])  

| Param | Type | Description |
| --- | --- | --- |
| error (optional) | ````string```` | Response `Error`. |  
| data (optional) | ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Response data or object with error data. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
