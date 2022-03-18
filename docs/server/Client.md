# Client (server)
extends [pc.EventHandler]

Client interface which is created for each individual connection. Client can connect multiple nodes

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  

### Events

<a href='#event_disconnect'>disconnect</a>  
<a href='#event_destroy'>destroy</a>  

### Functions

<a href='#function_send'>send(name, [data])</a>  
<a href='#function_isConnectedToNode'>isConnectedToNode(node)</a>  
<a href='#function_connectToNode'>connectToNode(node)</a> [async]  
<a href='#function_disconnect'>disconnect()</a>  


---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Unique identifier per connection.



# Events

<a name='event_disconnect'></a>
### <a href='#event_disconnect'>disconnect</a> [event]  
Fired when client gets disconnected, before all related data is destroyed.



<a name='event_destroy'></a>
### <a href='#event_destroy'>destroy</a> [event]  
Fired after disconnect and related data is destroyed.



# Functions

<a name='function_send'></a>
### <a href='#function_send'>send(name, [data])</a>  

TODO???

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | Name of a message. |  
| data (optional) | `object` &#124; `array` &#124; `string` &#124; `number` &#124; `boolean` | Optional message data. |  


<a name='function_isConnectedToNode'></a>
### <a href='#function_isConnectedToNode'>isConnectedToNode(node)</a>  

TODO???

| Param | Type | Description |
| --- | --- | --- |
| node | `Node` | Node |  


<a name='function_connectToNode'></a>
### <a href='#function_connectToNode'>connectToNode(node)</a> [async]  

TODO???

| Param | Type | Description |
| --- | --- | --- |
| node | `Node` | Node |  


<a name='function_disconnect'></a>
### <a href='#function_disconnect'>disconnect()</a>  

Force disconnect a [Client].





[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[Client]: ./Client.md  
