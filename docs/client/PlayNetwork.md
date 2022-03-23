# PlayNetwork (client)
extends [pc.EventHandler]

Main interface to connect to a server and interact with networked data.

---

# Index

### Properties

<a href='#property_users'>.users</a> : [Users]  
<a href='#property_rooms'>.rooms</a> : [Rooms]  
<a href='#property_levels'>.levels</a> : `Levels`  

### Events

<a href='#event_connect'>connect</a> => (user)  
<a href='#event_disconnect'>disconnect</a>  
<a href='#event_error'>error</a> => (error)  

### Functions

<a href='#function_connect'>connect(host, port, callback)</a>  
<a href='#function_send'>send(name, [data], [callback])</a>  


---


# Properties

<a name='property_users'></a>
### <a href='#property_users'>.users</a> : [Users]  
Interface to access all known [User]s to a client.

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : [Rooms]  
Interface with a list of all [Room]s that [User] has joined.

<a name='property_levels'></a>
### <a href='#property_levels'>.levels</a> : `Levels`  



# Events

<a name='event_connect'></a>
### <a href='#event_connect'>connect</a> [event] => (user)  
Fired when client has connected to a server and received an own [User] data.

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | Own user instance. |  


<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event]  
Fired after client has been disconnected from a server.



<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Fired when networking error occurs.

| Param | Type |
| --- | --- |
| error | `Error` |  


# Functions

<a name='function_connect'></a>
### <a href='#function_connect'>connect(host, port, callback)</a>  

Create a WebSocket connection to the server.

| Param | Type | Description |
| --- | --- | --- |
| host | `string` | Host to connect to |  
| port | `string` | Port to connect to |  
| callback | <a href='#callback_connectCallback'>connectCallback</a> | Callback that will be fired when connection is succesfull. |  


<a name='function_send'></a>
### <a href='#function_send'>send(name, [data], [callback])</a>  


| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` &#124; `null` | Data for a message, should be a JSON friendly data. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Response callback that will be called when server sends response message. This is similar to RPC. |  



# Callbacks

<a name='callback_connectCallback'></a>
### <a href='#callback_connectCallback'>connectCallback</a> [callback] => (user)  

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | Our [User] object. |  




<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, data)  

| Param | Type | Description |
| --- | --- | --- |
| error | ````string```` | Response `Error`. |  
| data | ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` &#124; ````null```` | Response data. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Users]: ./Users.md  
[Room]: ./Room.md  
[Rooms]: ./Rooms.md  
