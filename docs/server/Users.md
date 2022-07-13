# Users (server)
extends [pc.EventHandler]

Interface of all [User]s currently connected to a server.

---

# Index

### Events

<a href='#event_connect'>connect</a> => (user)  
<a href='#event_disconnect'>disconnect</a> => (user)  

### Functions

<a href='#function_get'>get(id)</a> => [User] &#124; `null`  


---



# Events

<a name='event_connect'></a>
### <a href='#event_connect'>connect</a> [event] => (user)  
Fired when new user has been connected.

| Param | Type |
| --- | --- |
| user | [User] |  


<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event] => (user)  
Fired when a user has been disconnected.

| Param | Type |
| --- | --- |
| user | [User] |  


# Functions

<a name='function_get'></a>
### <a href='#function_get'>get(id)</a>  
  
**Returns:** [User] | `null`  
Get [User] by ID

| Param | Type |
| --- | --- |
| id | `number` |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
