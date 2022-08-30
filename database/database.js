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

    async getCartItemsDetails(order) {
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
            result.push(obj);
        }
        return result;
    }

    async getTempOrderDetails() {
        var result = [];
        var q1 = 'select orderID from temp_order group by orderID';
        var orders = await this.connection.query(q1);
        var q2 = 'select prodID,quantity from temp_order where orderID=?';
        var q3 = 'select unit_price from products where item_code=?'
        for (let i = 0; i < orders[0].length; i++) {
            const element = orders[0][i];
            var orderItems = await this.connection.execute(q2, [element.orderID]);
            var billTotal = 0;
            for (let j = 0; j < orderItems[0].length; j++) {
                const element2 = orderItems[0][j];
                var price = await this.connection.execute(q3, [element2.prodID]);
                billTotal += parseFloat(price[0][0].unit_price) * parseFloat(element2.quantity);
            }
            var obj = {
                orderID: element.orderID,
                itemCount: orderItems[0].length,
                billTot: billTotal
            }
            result.push(obj);
        }
        // console.log(result);
        return result;
    }

    async getTempOrder(id) {
        var q = 'select prodID,quantity from temp_order where orderID=?';
        var items = await this.connection.execute(q, [id]);
        var result = [];
        var q = 'select name,unit_price from products where item_code=?';
        for (let i = 0; i < items[0].length; i++) {
            const element = items[0][i];
            var r = await this.connection.execute(q, [element.prodID]);
            var obj = {
                item_code: element.prodID,
                item_name: r[0][0].name,
                item_price: r[0][0].unit_price,
                item_quantity: element.quantity
            };
            result.push(obj);
        }
        return result;
    }


    async getOrderHandlingPersonell(type1, type2) {
        var q = 'select user_name from users where type=? && status=true';
        var result1 = await this.connection.execute(q, [type1]);
        var result2 = await this.connection.execute(q, [type2]);
        var result = [result1[0][0], result2[0][0]];
        // console.log(result);
        return result;
    }



    // * --------------------- CREATE OPERATIONS ---------------------------------

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

    async createSalesOrder(id) {
        var type = 'sales';
        var total = 0;
        var orderItems = await this.getTempOrder(id);
        var q1 = 'insert into orderdetails(order_no,type,order_date,sub_total) values (?,?,?,?)';
        var q2 = 'insert into order_product(order_id,product_code,quantity) values (?,?,?)';
        for (let i = 0; i < orderItems.length; i++) {
            const element = orderItems[i];
            var res1 = await this.connection.execute(q2, [id, element.item_code, element.item_quantity]);
            total += parseFloat(element.item_price) * parseFloat(element.item_quantity);
        }
        var date = this.#getCurrDateTime();
        var res2 = await this.connection.execute(q1, [id, type, date, total]);
        var deleteItem = await this.deleteTempOrder(id);
        return res2[0];
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

    async deleteTempOrder(id) {
        var q = 'delete from temp_order where orderID=?';
        const result = await this.connection.execute(q, [id]);
        return result[0];
    }

    // * ------------------------- UTILITY FUNCTIONS ----------------------------------


    #getCurrDateTime() {
        var t = new Date();
        var YYYY = t.getFullYear();
        var MM = ((t.getMonth() + 1 < 10) ? '0' : '') + (t.getMonth() + 1);
        var DD = ((t.getDate() < 10) ? '0' : '') + t.getDate();
        var HH = ((t.getHours() < 10) ? '0' : '') + t.getHours();
        var mm = ((t.getMinutes() < 10) ? '0' : '') + t.getMinutes();
        var ss = ((t.getSeconds() < 10) ? '0' : '') + t.getSeconds();
        var time_of_call = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;
        return time_of_call;
    }

}

module.exports = new database();