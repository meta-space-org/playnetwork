# User (client)
extends [pc.EventHandler]

User object that is created for each [User] we know, including ourself.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_rooms'>.rooms</a> : [Set]<[Room]>  
<a href='#property_me'>.me</a> : `boolean`  

### Events

<a href='#event_join'>join</a> => (room)  
<a href='#event_leave'>leave</a> => (room)  
<a href='#event_destroy'>destroy</a>  



---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical ID of a [User].

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : [Set]<[Room]>  
List of [Room]s that [User] has joined to.

<a name='property_me'></a>
### <a href='#property_me'>.me</a> : `boolean`  
True if [User] object is our own.



# Events

<a name='event_join'></a>
### <a href='#event_join'>join</a> [event] => (room)  
Fired when [User] has joined a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | To which [User] has joined. |  


<a name='event_leave'></a>
### <a href='#event_leave'>leave</a> [event] => (room)  
Fired when a [User] left a [Room].

| Param | Type | Description |
| --- | --- | --- |
| room | [Room] | From which [User] has left. |  


<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired when [User] has been destroyed (not known to client anymore).





[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Room]: ./Room.md  
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
