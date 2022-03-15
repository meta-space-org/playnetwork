export default class Client {
    static ids = 1;

    constructor(socket) {
        this.id = Client.ids++;
        this.nodes = new Map();
        this.socket = socket;
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
    }

    isConnectedToNode(node) {
        return this.nodes.has(node.id);
    }

    async connectToNode(node) {
        this.nodes.set(node.id, node);

        return new Promise((resolve) => {
            node.send('_open', this.id, () => {
                resolve();
            });
        });
    }

    disconnect() {
        for (const [_, node] of this.nodes) {
            node.send('_close', this.id);
        }
    }
}
