class realtimeNotify {


    constructor() {
        console.log('realtime notify data holder created...');
        this.users = [];
    };

    addOrUpdateUser(username, socketID) {
        if (this.users.length > 0) {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].username === username) {
                    this.users[i].id = socketID;
                    return;
                }
            }
        }
        var obj = {
            username: username,
            id: socketID
        };
        this.users.push(obj);
    }

    retrieveSocketId(username) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                // console.log("Found " + this.users.length);
                // console.log(this.users[i].id);
                return this.users[i].id;
            }
        }
    }


}

module.exports = new realtimeNotify();