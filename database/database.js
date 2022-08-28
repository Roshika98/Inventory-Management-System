const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

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

    async getCartDetails() {
        var q = 'select * from cart';
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

    async getOrderHandlingPersonell(type1, type2) {
        var q = 'select user_name from users where type=? && status=true';
        var result1 = await this.connection.execute(q, [type1]);
        var result2 = await this.connection.execute(q, [type2]);
        var result = [result1[0][0], result2[0][0]];
        console.log(result);
        return result;
    }



    // * ------------------ -- CREATE OPERATIONS ---------------------------------

    async addItemToCart(itemCode, quantity) {
        var q = 'insert into cart(item_no,quantity) values(?,?)';
        const result = await this.connection.execute(q, [itemCode, quantity]);
        return result[0];
    }


    async createTempOrder() {
        var id = uuidv4();
        var q = 'insert into temp_order(orderID,prodID,quantity) values(?,?,?)';
        var cartItems = await this.getCartDetails();
        for (var i = 0; i < cartItems.length; i++) {
            var result = await this.connection.execute(q, [id, cartItems[i].item_no, cartItems[i].quantity]);
        }
        var res = await this.deleteCurrCart();
        return res[0];
    }

    // *----------------------- UPDATE OPERATIONS --------------------------------

    async updateUserStatus(id, status) {
        var q = 'update users set status=? where user_id=?';
        const result = await this.connection.execute(q, [status, id]);
        return result[0];
    }

    // *----------------------- DELETE OPERATIONS --------------------------------

    async deleteCartItem(id) {
        var q = 'delete from cart where item_no=?';
        const result = await this.connection.execute(q, [id]);
        return result[0];
    }

    async deleteCurrCart() {
        var q = 'delete from cart';
        const result = await this.connection.query(q);
        return result[0];
    }

}

module.exports = new database();