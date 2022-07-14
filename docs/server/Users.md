# Users (server)
extends [pc.EventHandler]

Interface of all [User]s currently connected to a server. As well as for handling new user authentication.

---

# Index

### Events

<a href='#event_connect'>connect</a> => (user)  
<a href='#event_disconnect'>disconnect</a> => (user)  
<a href='#event_authenticate'>authenticate</a> => (payload, callback)  

### Functions

<a href='#function_get'>get(id)</a> => [User] &#124; `null`  


---



# Events

<a name='event_connect'></a>
### <a href='#event_connect'>connect</a> [event] => (user)  
Fired when new user has been connected.

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event] => (user)  
Fired when a user has been disconnected.

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='event_authenticate'></a>
### <a href='#event_authenticate'>authenticate</a> [event] => (payload, callback)  
Event to handle new connected sockets and authenticate a user. Callback should be called with an error or userId provided.

| Param | Type | Description |
| --- | --- | --- |
| payload | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Payload data sent from a client. |  
| callback | <a href='#callback_authenticateCallback'>authenticateCallback</a> | Callback that should be called when authentication is finished. By providing userId - authentication considered successfull. |  


# Functions

<a name='function_get'></a>
### <a href='#function_get'>get(id)</a>  
  
**Returns:** [User] | `null`  
Get [User] by ID

| Param | Type |
| --- | --- |
| id | `number` |  



# Callbacks

<a name='callback_authenticateCallback'></a>
### <a href='#callback_authenticateCallback'>authenticateCallback</a> [callback] => ([error], userId)  

| Param | Type | Description |
| --- | --- | --- |
| error (optional) | [Error] | [Error] object if authentication failed. |  
| userId | `number` &#124; `string` | User ID if authentication succeeded. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
