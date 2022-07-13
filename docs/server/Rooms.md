# Rooms (server)
extends [pc.EventHandler]

Interface with a list of all [Room]s and new rooms creation logic.

---

# Index

### Events

<a href='#event_join'>join</a> => (room, user)  
<a href='#event_leave'>leave</a> => (room, user)  

### Functions

<a href='#function_create'>create(levelId, [tickrate])</a> [async] => [Room]  
<a href='#function_get'>get(id)</a> => [Room] &#124; `null`  
<a href='#function_has'>has(id)</a> => `boolean`  


---



# Events

<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (room, user)  
Fired when a [User] successfully joined a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | [Room] to which a [User] joined. |  
| user | [User] | [User] who joined. |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (room, user)  
Fired when a [User] left a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | [Room] from which a [User] has left. |  
| user | [User] | [User] who has left. |  


# Functions

<a name='function_create'></a>
### <a href='#function_create'>create(levelId, [tickrate])</a> [async]  
  
**Returns:** [Room]  
Function to create a new [Room]. It will load a level by provided ID and start new [Room] with a [pc.Application].

| Param | Type | Description |
| --- | --- | --- |
| levelId | `number` | ID Number of a level. |  
| tickrate (optional) | `number` | Tick rate - is how many times Application will be calling `update` in a second. |  


<a name='function_get'></a>
### <a href='#function_get'>get(id)</a>  
  
**Returns:** [Room] | `null`  
Get a [Room] by ID.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [Room]. |  


<a name='function_has'></a>
### <a href='#function_has'>has(id)</a>  
  
**Returns:** `boolean`  
Check if a [Room] with a specific ID exists.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [Room]. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Room]: ./Room.md  
[pc.Application]: https://developer.playcanvas.com/en/api/pc.Application.html  
[User]: ./User.md  
