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
<a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
<a href='#property_memory'>.memory</a> : `number`  

### Events

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
Map of all [NetworkEntity]s created by this server.

<a name='property_cpuLoad'></a>
### <a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
Current CPU load 0..1.

<a name='property_memory'></a>
### <a href='#property_memory'>.memory</a> : `number`  
Current memory usage in bytes.



# Events

<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Unhandled error.

| Param | Type | Description |
| --- | --- | --- |
| error | [Error] | [Error] object. |  


<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => (sender, [data], callback)  
[PlayNetwork] will receive own named network messages. Those messages are sent by the clients.

| Param | Type | Description |
| --- | --- | --- |
| sender | [User] | User that sent the message. |  
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  
| callback | <a href='#callback_responseCallback'>responseCallback</a> | Callback that can be called to respond to a message. |  


# Functions

<a name='function_start'></a>
### <a href='#function_start'>start(settings)</a> [async]  

Start PlayNetwork, by providing configuration parameters.

| Param | Type | Description |
| --- | --- | --- |
| settings | `object` | Object with settings for initialization. |  
| settings.redisUrl | `string` | URL of a [Redis] server. |  
| settings.websocketUrl | `string` | Publicly or inter-network accessible URL to this servers WebSocket endpoint. |  
| settings.scriptsPath | `string` | Relative path to script components. |  
| settings.templatesPath | `string` | Relative path to templates. |  
| settings.levelProvider | `object` | Instance of a level provider. |  
| settings.server | `http.Server` &#124; `https.Server` | Instance of a http(s) server. |  



# Callbacks

<a name='callback_responseCallback'></a>
### <a href='#callback_responseCallback'>responseCallback</a> [callback] => (error, data)  

| Param | Type | Description |
| --- | --- | --- |
| error | ````null```` &#124; ```[Error]``` | Error provided with a response. |  
| data | ````null```` &#124; ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data provided with a response. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Redis]: https://redis.io/  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
[PlayNetwork]: ./PlayNetwork.md  
[User]: ./User.md  
[Users]: ./Users.md  
[Rooms]: ./Rooms.md  
[NetworkEntity]: ./NetworkEntity.md  
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map  
