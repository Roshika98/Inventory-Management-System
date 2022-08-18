const mysql = require('mysql2/promise');

class database {
    constructor() {
        this.dbParams = {
            host: process.env.DATABASE_URL,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME
        };
        this.connection = mysql.createPool(this.dbParams);
        console.log('database handler instance created..');
    }

    async getUserDetails(id) {
        var q = 'select user_name,email,type from users where user_id=?';
        const result = await this.connection.execute(q, [id]);
        console.log(result[0][0]);
    }



}

module.exports = new database();