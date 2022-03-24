# Node (node)
extends [pc.EventHandler]

Each `WorkerNode` creates a worker process and instantiates a [Node], which is running in own thread on a single core. `PlayNetwork` creates multiple `WorkerNode`s to utilize all available CPU threads of a server. [Node] handles multiple [User]s and [Room]s.

---

# Index

### Properties

<a href='#property_users'>.users</a> : [Users]  
<a href='#property_rooms'>.rooms</a> : [Rooms]  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
<a href='#property_cpuLoad'>.cpuLoad</a> : `number`  
<a href='#property_memory'>.memory</a> : `number`  

### Events

<a href='#event_error'>error</a> => (error)  

### Functions

<a href='#function_start'>start(levelProvider)</a> [async]  


---


# Properties

<a name='property_users'></a>
### <a href='#property_users'>.users</a> : [Users]  
Interface with list of this Node [User]s.

<a name='property_rooms'></a>
### <a href='#property_rooms'>.rooms</a> : [Rooms]  
Interface with list of this Node [Room]s.

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
Unhandled error.

| Param | Type |
| --- | --- |
| error | `Error` |  


# Functions

<a name='function_start'></a>
### <a href='#function_start'>start(levelProvider)</a> [async]  

Start a Node, by providing Level Provider (to save/load hierarchy data)

| Param | Type | Description |
| --- | --- | --- |
| levelProvider | `object` | Instance of a level provider. |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Node]: ./Node.md  
[User]: ./User.md  
[Room]: ./Room.md  
[Users]: ./Users.md  
[Rooms]: ./Rooms.md  
