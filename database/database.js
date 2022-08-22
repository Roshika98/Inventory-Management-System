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
        var q = 'select user_name,email,type,first_name,last_name,mobile_no from users where user_id=?';
        const result = await this.connection.execute(q, [id]);
        return result[0][0];
    }

    async getUserName(id) {
        var q = 'select user_name from users where user_id=?';
        const result = await this.connection.execute(q, [id]);
        return result[0][0];
    }

    async searchForProducts(prodName) {
        var q = 'select products.item_code,name,product_details,picture_url,unit_price,quantity from products inner join stocks on ' +
            `products.item_code=stocks.item_code where products.name like '%${prodName}%'`;
        const result = await this.connection.query(q);
        return result[0];
    }

}

module.exports = new database();