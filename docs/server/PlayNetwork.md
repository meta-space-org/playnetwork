# PlayNetwork (server)
extends [pc.EventHandler]

Main interface of PlayNetwork

---

# Index

### Events

<a href='#event_error'>error</a>  

### Functions

<a href='#function_start'>start(settings)</a> [async]  


---



# Events

<a name='event_error'></a>
### <a href='#event_error'>error</a> [event]  
TODO



# Functions

<a name='function_start'></a>
### <a href='#function_start'>start(settings)</a> [async]  

Start PlayNetwork, by providing configuration parameters, Level Provider (to save/load hierarchy data) and HTTP(s) server handle.

| Param | Type | Description |
| --- | --- | --- |
| settings | `object` | Object with settings for initialization. |  
| settings.nodePath | `object` | node path |  
| settings.scriptsPath | `string` | Relative path to script components. |  
| settings.templatesPath | `string` | Relative path to templates. |  
| settings.server | `object` | Instance of a http server. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
