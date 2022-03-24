# Client (server)
extends [pc.EventHandler]

Client interface which is created for each individual connection. Client can connect multiple nodes

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  
<a href='#property_latency'>.latency</a> : `number`  
<a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
<a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  

### Events

<a href='#event_disconnect'>disconnect</a>  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_disconnect'>disconnect()</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique identifier per connection.

<a name='property_latency'></a>
### <a href='#property_latency'>.latency</a> : `number`  
Network latency in miliseconds.

<a name='property_bandwidthIn'></a>
### <a href='#property_bandwidthIn'>.bandwidthIn</a> : `number`  
Bandwidth of incoming data in bytes per second.

<a name='property_bandwidthOut'></a>
### <a href='#property_bandwidthOut'>.bandwidthOut</a> : `number`  
Bandwidth of outgoing data in bytes per second.



# Events

<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event]  
Fired when client gets disconnected, before all related data is destroyed.



<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired after disconnect and related data is destroyed.



# Functions

<a name='function_disconnect'></a>
### <a href='#function_disconnect'>disconnect()</a>  

Force disconnect a [Client].





[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Client]: ./Client.md  
