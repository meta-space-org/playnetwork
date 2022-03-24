# Users (node)
extends [pc.EventHandler]

Global interface of all [User]s. It provides events when users are connected and disconnected.

---

# Index

### Events

<a href='#event_connect'>connect</a>  
<a href='#event_disconnect'>disconnect</a>  

### Functions

<a href='#function_get'>get(id)</a> => [User] &#124; `null`  


---



# Events

<a name='event_connect'></a>
### <a href='#event_connect'>connect</a> [event]  
Fired when new user has been connected.



<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event]  
Fired when a user has been disconnected.



# Functions

<a name='function_get'></a>
### <a href='#function_get'>get(id)</a>  
  
**Returns:** [User] | `null`  
Get user by ID

| Param | Type |
| --- | --- |
| id | `number` |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
