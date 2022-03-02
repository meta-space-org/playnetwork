# PlayNetwork
extends [pc.EventHandler]

Main interface of PlayNetwork, which provides access to all process [User]s and [Room]s.

---

# Index

### Properties

<a href='#property_users'>.users</a> : [Users]  
<a href='#property_rooms'>.rooms</a> : [Rooms]  


### Functions

<a href='#function_initialize'>initialize(settings)</a> [async]  


---


# Properties

<a name='property_users'></a>
### <a href='#property_users'>.users</a> : [Users]  
Interface with list of all [User]s.

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : [Rooms]  


# Functions

<a name='function_initialize'></a>
### <a href='#function_initialize'>initialize(settings)</a> [async]  

Initialize PlayNetwork, by providing configuration parameters, Level Provider (to save/load hierarchy data) and HTTP(s) server handle.

| Param | Type | Description |
| --- | --- | --- |
| settings | `object` | Object with settings for initialization. |  
| settings.levelProvider | `object` | Instance of level provider. |  
| settings.scriptsPath | `string` | Relative path to script components. |  
| settings.templatesPath | `string` | Relative path to templates. |  
| settings.server | `object` | Instance of a http server. |  



[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[User]: ./User.md  
[Room]: ./Room.md  
[Users]: ./Users.md  
[Rooms]: ./Rooms.md  

