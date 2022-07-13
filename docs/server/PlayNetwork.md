# PlayNetwork (server)
extends [pc.EventHandler]

Main interface of PlayNetwork server. This class handles clients connection and communication.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_users'>.users</a> : [Users]  
<a href='#property_rooms'>.rooms</a> : [Rooms]  
<a href='#property_networkEntities'>.networkEntities</a> : [Map]<`number`, [NetworkEntity]>  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
<a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
<a href='#property_memory'>.memory</a> : `number`  

### Events

<a href='#event_authenticate'>authenticate</a> => (user, [payload], callback)  
<a href='#event_error'>error</a> => (error)  
<a href='#event_*'>*</a> => (sender, [data], callback)  

### Functions

<a href='#function_start'>start(settings)</a> [async]  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical ID of the server.

<a name='property_users'></a>
### <a href='#property_users'>.users</a> : [Users]  
[Users] interface that stores all connected users.

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : [Rooms]  
[Rooms] interface that stores all rooms and handles new [Rooms] creation.

<a name='property_networkEntities'></a>
### <a href='#property_networkEntities'>.networkEntities</a> : [Map]<`number`, [NetworkEntity]>  
All [NetworkEntity]s.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.

<a name='property_cpuLoad'></a>
### <a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
Current CPU load 0..1.

<a name='property_memory'></a>
### <a href='#property_memory'>.memory</a> : `number`  
Current memory usage in bytes.



# Events

<a name='event_authenticate'></a>
### <a href='#event_authenticate'>authenticate</a> [event] => (user, [payload], callback)  
If anyone is subscribed to this event, fired when a client is trying to connect to server.

| Param | Type | Description |
| --- | --- | --- |
| user | [User] | User that is trying to authenticate. |  
| payload | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Payload that is sent to the server. |  
| callback | <a href='#callback_authenticateCallback'>authenticateCallback</a> | Callback that should be called when authentication is finished. |  


<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Unhandled error.

| Param | Type | Description |
| --- | --- | --- |
| error | [Error] | [Error] object. |  


<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => (sender, [data], callback)  
[PlayNetwork] will receive own named network messages.

| Param | Type | Description |
| --- | --- | --- |
| sender | [User] | User that sent the message. |  
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  
| callback | <a href='#callback_messageCallback'>messageCallback</a> | Callback that can be called to indicate that message was handled, or to send [Error]. |  


# Functions

<a name='function_start'></a>
### <a href='#function_start'>start(settings)</a> [async]  

Start PlayNetwork, by providing configuration parameters.

| Param | Type | Description |
| --- | --- | --- |
| settings | `object` | Object with settings for initialization. |  
| settings.redisUrl | `string` | URL of [Redis] server. |  
| settings.scriptsPath | `string` | Relative path to script components. |  
| settings.templatesPath | `string` | Relative path to templates. |  
| settings.levelProvider | `object` | Instance of a level provider. |  
| settings.server | `http.Server` &#124; `https.Server` | Instance of a http(s) server. |  



# Callbacks

<a name='callback_authenticateCallback'></a>
### <a href='#callback_authenticateCallback'>authenticateCallback</a> [callback] => ([error], userId)  

| Param | Type | Description |
| --- | --- | --- |
| error (optional) | [Error] | [Error] object if authentication failed. |  
| userId | `number` &#124; `string` | User ID if authentication succeeded. |  




<a name='callback_messageCallback'></a>
### <a href='#callback_messageCallback'>messageCallback</a> [callback] => ([error], [data])  

| Param | Type | Description |
| --- | --- | --- |
| error (optional) | ```[Error]``` | [Error] object if message is handled incorrectly. |  
| data (optional) | ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data that will be sent to the sender. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Redis]: https://redis.io/  
[User]: ./User.md  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
[PlayNetwork]: ./PlayNetwork.md  
[Users]: ./Users.md  
[Rooms]: ./Rooms.md  
[NetworkEntity]: ./NetworkEntity.md  
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map  
