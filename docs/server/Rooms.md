# Rooms
extends [pc.EventHandler]

Interface with a list of all [PlayNetwork] [Room]s.

---

# Index

### Events

<a href='#event_create'>create</a> => (from, data)  
<a href='#event_join'>join</a> => (user, room)  
<a href='#event_leave'>leave</a> => (user, room)  

### Functions

<a href='#function_create'>create(levelId, tickrate)</a> [async] => [Room]  
<a href='#function_get'>get(id)</a> => [Room] &#124; `null`  
<a href='#function_has'>has(id)</a> => `boolean`  


---



# Events

<a name='event_create'></a>
### <a href='#event_create'>create</a> [event] => (from, data)  
Fired when [User] has requested room creation, with provided data. [Room] will not be created automatically, it is up to an application logic to decide.

| Param | Type | Description |
| --- | --- | --- |
| from | `[User]` | Who have sent a request. |  
| data | ``object`` | Data of a request. |  


<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (user, room)  
Fired when a [User] requests to join a [Room]. [User] will not join automatically, it is up to an application logic to decide.

| Param | Type | Description |
| --- | --- | --- |
| user | `[User]` | User who have requested to join a [Room]. |  
| room | `[Room]` | Room to which a [User] has requested to join. |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (user, room)  
Fired when a [User] leaves a [Room]. [User] will leave upon a request.

| Param | Type | Description |
| --- | --- | --- |
| user | `[User]` | User who have left a [Room]. |  
| room | `[Room]` | Room from which a [User] has left. |  


# Functions

<a name='function_create'></a>
### <a href='#function_create'>create(levelId, tickrate)</a> [async]  
  
**Returns:** [Room]  
Function to create a new Room. It will load a level by provided ID and start new context with a PlayCanvas Application.

| Param | Type | Description |
| --- | --- | --- |
| levelId | `number` | ID Number of a level. |  
| tickrate | `number` | Tick rate - is how many times Application will be calling `update` in a second. |  


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
Check a [Room] with a specific ID exists.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [Room]. |  



[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Room]: ./Room.md  
[User]: ./User.md  
[PlayNetwork]: ./PlayNetwork.md  
