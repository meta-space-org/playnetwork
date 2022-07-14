# PlayNetwork (client)
extends [pc.EventHandler]

Main interface to connect to a server and interact with networked data.

---

# Index

### Properties

<a href='#property_me'>.me</a> : [User]  
<a href='#property_room'>.room</a> : [Room]  
<a href='#property_latency'>.latency</a> : `number`  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
<a href='#property_levels'>.levels</a> : [Levels]  

### Events

<a href='#event_connect'>connect</a> => (user)  
<a href='#event_disconnect'>disconnect</a>  
<a href='#event_error'>error</a> => (error)  
<a href='#event_*'>*</a> => ([data])  

### Functions

<a href='#function_connect'>connect(host, port, useSSL, payload, callback)</a>  
<a href='#function_createRoom'>createRoom(data, callback)</a>  
<a href='#function_joinRoom'>joinRoom(id, callback)</a>  
<a href='#function_leaveRoom'>leaveRoom(callback)</a>  
<a href='#function_send'>send(name, [data], [callback])</a>  


---


# Properties

<a name='property_me'></a>
### <a href='#property_me'>.me</a> : [User]  
Local [User] object.

<a name='property_room'></a>
### <a href='#property_room'>.room</a> : [Room]  
[Room] that [User] has joined.

<a name='property_latency'></a>
### <a href='#property_latency'>.latency</a> : `number`  
Current network latency in miliseconds.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.

<a name='property_levels'></a>
### <a href='#property_levels'>.levels</a> : [Levels]  
Interface that allows to save hierarchy data to a server.



# Events

<a name='event_connect'></a>
### <a href='#event_connect'>connect</a> [event] => (user)  
Fired when client has connected to a server and received own [User] data.

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | Own [User] instance. |  


<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event]  
Fired after client has been disconnected from a server.



<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Fired when networking error occurs.

| Param | Type |
| --- | --- |
| error | [Error] |  


<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => ([data])  
Fired on receive of a named network messages.

| Param | Type | Description |
| --- | --- | --- |
| data | `null` &#124; `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  


# Functions

<a name='function_connect'></a>
### <a href='#function_connect'>connect(host, port, useSSL, payload, callback)</a>  

Create a WebSocket connection to the PlayNetwork server.

| Param | Type | Description |
| --- | --- | --- |
| host | `string` | Host of a server. |  
| port | `number` | Port of a server. |  
| useSSL | `boolean` | Use secure connection. |  
| payload | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` &#124; `null` | Client authentication data. |  
| callback | <a href='#callback_connectCallback'>connectCallback</a> | Will be fired when connection is succesfull or failed. |  


<a name='function_createRoom'></a>
### <a href='#function_createRoom'>createRoom(data, callback)</a>  

Send a request to a server, to create a [Room].

| Param | Type | Description |
| --- | --- | --- |
| data | `object` | Request data that can be used by Server to decide room creation. |  
| callback | <a href='#callback_createRoomCallback'>createRoomCallback</a> | Will be fired when room is created or failed. |  


<a name='function_joinRoom'></a>
### <a href='#function_joinRoom'>joinRoom(id, callback)</a>  

Send a request to a server, to join a [Room].

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [Room] to join. |  
| callback | <a href='#callback_joinRoomCallback'>joinRoomCallback</a> | Will be fired when [Room] is joined or failed. |  


<a name='function_leaveRoom'></a>
### <a href='#function_leaveRoom'>leaveRoom(callback)</a>  

Send a request to a server, to leave current [Room].

| Param | Type | Description |
| --- | --- | --- |
| callback | <a href='#callback_leaveRoomCallback'>leaveRoomCallback</a> | Will be fired when [Room] is left or failed. |  


<a name='function_send'></a>
### <a href='#function_send'>send(name, [data], [callback])</a>  

Send named message to the server.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | JSON friendly message data. |  
| callback (optional) | <a href='#callback_responseCallback'>responseCallback</a> | Callback that will be fired when a response message is received. |  



# Callbacks

<a name='callback_connectCallback'></a>
### <a href='#callback_connectCallback'>connectCallback</a> [callback] => (error, user)  

| Param | Type | Description |
| --- | --- | --- |
| error | `null` &#124; [Error] | Error if connection failed. |  
| user | `null` &#124; [User] | Own [User] object. |  




<a name='callback_createRoomCallback'></a>
### <a href='#callback_createRoomCallback'>createRoomCallback</a> [callback] => (error, roomId)  

| Param | Type | Description |
| --- | --- | --- |
| error | `null` &#124; [Error] | Error if failed to create a [Room]. |  
| roomId | `null` &#124; `number` | ID of a created [Room]. |  




<a name='callback_joinRoomCallback'></a>
### <a href='#callback_joinRoomCallback'>joinRoomCallback</a> [callback] => (error)  

| Param | Type | Description |
| --- | --- | --- |
| error | `null` &#124; [Error] | Error if failed to join a [Room]. |  




<a name='callback_leaveRoomCallback'></a>
### <a href='#callback_leaveRoomCallback'>leaveRoomCallback</a> [callback] => (error)  

| Param | Type | Description |
| --- | --- | --- |
| error | `null` &#124; [Error] | Error if failed to leave a [Room]. |  




<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, data)  

| Param | Type | Description |
| --- | --- | --- |
| error | ````null```` &#124; ```[Error]``` | Error provided with with a response. |  
| data | ````null```` &#124; ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data provided with a response. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Room]: ./Room.md  
[User]: ./User.md  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
[Levels]: ./Levels.md  
