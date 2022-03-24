# PlayNetwork (server)
extends [pc.EventHandler]

Main interface of PlayNetwork, which acts as a composer for [WorkerNode]s. It handles socket connections, and then routes them to the right `Node` based on message scope.

---

# Index

### Properties

<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
<a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
<a href='#property_memory'>.memory</a> : `number`  

### Events

<a href='#event_error'>error</a> => (error)  

### Functions

<a href='#function_start'>start(settings)</a> [async]  


---


# Properties

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.

<a name='property_cpuLoad'></a>
### <a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
Current CPU load 0..1.

<a name='property_memory'></a>
### <a href='#property_memory'>.memory</a> : `number`  
Current memory usage in bytes.



# Events

<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Unhandled error, which relates to server start or crash of any of the [WorkerNode]s.

| Param | Type |
| --- | --- |
| error | `Error` |  


# Functions

<a name='function_start'></a>
### <a href='#function_start'>start(settings)</a> [async]  

Start PlayNetwork, by providing configuration parameters, Level Provider (to save/load hierarchy data) and HTTP(s) server handle.

| Param | Type | Description |
| --- | --- | --- |
| settings | `object` | Object with settings for initialization. |  
| settings.nodePath | `object` | Relative path to node file. |  
| settings.scriptsPath | `string` | Relative path to script components. |  
| settings.templatesPath | `string` | Relative path to templates. |  
| settings.server | `object` | Instance of a http(s) server. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[WorkerNode]: ./WorkerNode.md  
