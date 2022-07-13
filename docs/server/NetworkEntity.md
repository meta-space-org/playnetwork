# NetworkEntity (server)
extends [pc.ScriptType]

NetworkEntity is a [pc.ScriptType], which is attached to a [pc.ScriptComponent] of an [pc.Entity] that needs to be synchronised between server and clients. It has unique ID, optional owner and list of properties to be synchronised. For convenience, [pc.Entity] has additional property: `entity.networkEntity`.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `string`  
<a href='#property_user'>.user</a> : [User]  
<a href='#property_properties'>.properties</a> : `Array.<Object>`  

### Events

<a href='#event_*'>*</a> => (sender, [data], callback)  

### Functions

<a href='#function_send'>send(name, [data])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `string`  
Unique identifier.

<a name='property_user'></a>
### <a href='#property_user'>.user</a> : [User]  
Optional [User] to which this [pc.Entity] is related.

<a name='property_properties'></a>
### <a href='#property_properties'>.properties</a> : `Array.<Object>`  
List of properties, which should be synchronised and optionally can be interpolated. Each property `object` has these properties:

| Param | Type | Description |
| --- | --- | --- |
| path | `string` | Path to a property. |
| interpolate | `boolean` | If value is type of: `number` &#124; `Vec2` &#124; `Vec3` &#124; `Vec4` &#124; `Quat` &#124; `Color`, then it can be interpolated. |
| ignoreForOwner | `boolean` | If `true` then server will not send this property updates to an owner. |



# Events

<a name='event_*'></a>
### <a href='#event_*'>*</a> [event] => (sender, [data], callback)  
[NetworkEntity] will receive own named network messages.

| Param | Type | Description |
| --- | --- | --- |
| sender | [User] | [User] that sent the message. |  
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Message data. |  
| callback | <a href='#callback_messageCallback'>messageCallback</a> | Callback that can be called to indicate that message was handled, or to send [Error]. |  


# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send a named message to a [NetworkEntity].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | JSON friendly message data. |  



# Callbacks

<a name='callback_messageCallback'></a>
### <a href='#callback_messageCallback'>messageCallback</a> [callback] => ([error], [data])  

| Param | Type | Description |
| --- | --- | --- |
| error (optional) | ```[Error]``` | [Error] object if message is handled incorrectly. |  
| data (optional) | ````object```` &#124; ````array```` &#124; ````string```` &#124; ````number```` &#124; ````boolean```` | Data that will be sent to the sender. |  




[pc.ScriptType]: https://developer.playcanvas.com/en/api/pc.ScriptType.html  
[NetworkEntity]: ./NetworkEntity.md  
[User]: ./User.md  
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error  
[pc.ScriptComponent]: https://developer.playcanvas.com/en/api/pc.ScriptComponent.html  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
