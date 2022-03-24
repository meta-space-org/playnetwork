# WorkerNode (server)
extends [pc.EventHandler]

Each [WorkerNode] is a worker, running in own process, [PlayNetwork] creates multiple [WorkerNode]s to utilize all available CPUs of a server. And contains routing information for network messages, and a channel for a communication to `Node` process.

---

# Index

### Properties

<a href='#property_id'>.id</a> : `number`  

### Events

<a href='#event_error'>error</a> => (error)  



---


# Properties

<a name='property_id'></a>
### <a href='#property_id'>.id</a> : `number`  
Numerical identifier of a [WorkerNode].



# Events

<a name='event_error'></a>
### <a href='#event_error'>error</a> [event] => (error)  
Error that is fired by a `Node` process.

| Param | Type |
| --- | --- |
| error | `Error` |  




[pc.EventHandler]: https://developer.playcanvas.com/en/api/pc.EventHandler.html  
[WorkerNode]: ./WorkerNode.md  
[PlayNetwork]: ./PlayNetwork.md  
