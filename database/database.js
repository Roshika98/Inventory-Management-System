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

    // * ---------------------- READ OPERATIONS ------------------------------------------


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

    async getProductDetails(id) {
        var q = 'select * from products where item_code=?';
        const result = await this.connection.execute(q, [id]);
        return result[0][0];
    }

    async getTempCustOrders() {
        var q = 'select * from cust_orders_temp';
        const result = await this.connection.query(q);
        return result[0];
    }

    async getOrderItemsDetails(order) {
        var result = [];
        var q = 'select name,unit_price from products where item_code=?';
        for (let i = 0; i < order.length; i++) {
            const element = order[i];
            var r = await this.connection.execute(q, [element.item_no]);
            var obj = {
                item_code: element.item_no,
                item_name: r[0][0].name,
                item_price: r[0][0].unit_price,
                item_quantity: element.quantity
            };
            // console.log(obj);
            result.push(obj);
        }
        return result;
    }



    // * ------------------ CREATE OPERATIONS ---------------------------------

    async addTempItem(itemCode, quantity) {
        var q = 'insert into cust_orders_temp(item_no,quantity) values(?,?)';
        const result = await this.connection.execute(q, [itemCode, quantity]);
        return result[0];
    }

}

module.exports = new database();