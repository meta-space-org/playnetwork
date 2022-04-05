# Server


### <a href='./PlayNetwork.md'>PlayNetwork</a>  
Main interface of PlayNetwork, which acts as a composer for [WorkerNode]s. It handles socket connections, and then routes them to the right `Node` based on message scope.

### <a href='./Client.md'>Client</a>  
Client interface which is created for each individual connection. It can be connected to multiple [WorkerNode]s, and represents a single `User`.

### <a href='./WorkerNode.md'>WorkerNode</a>  
Each [WorkerNode] is a worker, running in own process, [PlayNetwork] creates multiple [WorkerNode]s to utilize all available CPU threads of a server. And contains routing information for network messages, and a channel for a communication to `Node` process.


[WorkerNode]: ./WorkerNode.md  
[PlayNetwork]: ./PlayNetwork.md  
