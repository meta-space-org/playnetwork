# NetworkEntity (client)
extends [pc.ScriptType]

NetworkEntity is a [pc.ScriptType], which is attached to a [pc.ScriptComponent] of an [pc.Entity] that needs to be synchronised between server and clients. It has unique ID, optional owner and list of properties to be synchronised. For convenience, [pc.Entity] has additional property: `entity.networkEntity`.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_player'>.player</a> : [Player]  
<a href='#property_properties'>.properties</a> : `Array.<Object>`  

### Events

<a href='#event_*'>*</a> => ([data])  

### Functions

<a href='#function_send'>send(name, [data])</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique identifier.

<a name='property_player'></a>
### <a href='#property_player'>.player</a> : [Player]  
Optional [Player] to which this [pc.Entity] is related.

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
### <a href='#event_*'>*</a> [event] => ([data])  
[NetworkEntity] can receive named networked messaged.

| Param | Type | Description |
| --- | --- | --- |
| data | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional data of a message. |  


# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

Send a named message to a [NetworkEntity].

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional message data. Must be JSON friendly data. |  




[pc.ScriptType]: https://developer.playcanvas.com/en/api/pc.ScriptType.html  
[NetworkEntity]: ./NetworkEntity.md  
[pc.ScriptComponent]: https://developer.playcanvas.com/en/api/pc.ScriptComponent.html  
[pc.Entity]: https://developer.playcanvas.com/en/api/pc.Entity.html  
[Player]: ./Player.md  
