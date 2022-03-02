# Rooms
extends [pc.EventHandler]

Interface to get [Room]s as well as request a [Room] create, join and leave.

---

# Index


### Functions

<a href='#function_create'>create(data, [callback])</a>  
<a href='#function_join'>join(roomId, [callback])</a>  
<a href='#function_leave'>leave(roomId, [callback])</a>  
<a href='#function_get'>get(id)</a> => [Room] &#124; `null`  
<a href='#function_has'>has(id)</a> => `boolean`  


---


# Functions

<a name='function_create'></a>
### <a href='#function_create'>create(data, [callback])</a>  

Send a request to a server, to create a [Room].

| Param | Type | Description |
| --- | --- | --- |
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Request data that can be user by Server to decide room creation. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Response callback, which is called when client receives server response for this specific request. |  


<a name='function_join'></a>
### <a href='#function_join'>join(roomId, [callback])</a>  

Send a request to a server, to join a [Room].

| Param | Type | Description |
| --- | --- | --- |
| roomId | `number` | ID of a [Room] to join. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Response callback, which is called when client receives server response for this specific request. |  


<a name='function_leave'></a>
### <a href='#function_leave'>leave(roomId, [callback])</a>  

Send a request to a server, to leave a [Room].

| Param | Type | Description |
| --- | --- | --- |
| roomId | `number` | ID of a [Room] to leave. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Response callback, which is called when client receives server response for this specific request. |  


<a name='function_get'></a>
### <a href='#function_get'>get(id)</a>  
  
**Returns:** [Room] | `null`  
Get [Room] by numerical ID.

| Param | Type |
| --- | --- |
| id | `number` |  


<a name='function_has'></a>
### <a href='#function_has'>has(id)</a>  
  
**Returns:** `boolean`  
Check if we are joined to a [Room] by numerical ID.

| Param | Type |
| --- | --- |
| id | `number` |  



[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Room]: ./Room.md  

# Callbacks

<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, data)  

| Param | Type | Description |
| --- | --- | --- |
| error | ````string```` | Response `Error`. |  
| data | ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` &#124; ````null```` | Response data. |  




