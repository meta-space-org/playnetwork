export default class User {
    constructor(socket, id) {
        this.id = id;
        this.socket = socket;
        this.rooms = new Map();
    }

    send(name, data) {
        this.socket.emit(name, data);
    }
}
