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

    async getInventoryItems(iteration) {
        var count = (iteration - 1) * 10;
        var q = 'select products.item_code as itemID, products.name as prodName,stocks.quantity as' +
            ` quantity from products INNER JOIN stocks on products.item_code=stocks.item_code LIMIT ${count},10`;
        const result = await this.connection.query(q);
        return result[0];
    }

    async getProdsToBeFilled() {
        var q = 'select products.item_code as itemID,products.name as prodName,stocks.quantity as quantity from products ' +
            'inner join stocks on products.item_code=stocks.item_code where stocks.quantity<100 && stocks.placed_Order=false';
        const result = await this.connection.query(q);
        return result[0];
    }

    async getRestockDetails(id) {
        var q1 = 'select name from products where item_code=?';
        var q2 = 'select sup_id,name as sup_name from suppliers';
        const prodDetails = await this.connection.execute(q1, [id]);
        const suppDetails = await this.connection.query(q2);
        const result = {
            prodID: id,
            prodName: prodDetails[0][0].name,
            supplierDetails: suppDetails[0]
        };
        return result;
    }

    async getTempRestockOrders() {
        var result = [];
        var q1 = 'select * from temp_restock';
        var restockOrders = await this.connection.query(q1);
        var q2 = 'select name as suppName from suppliers where sup_id=?';
        var q3 = 'select name as itemName from products where item_code=?';
        for (let i = 0; i < restockOrders[0].length; i++) {
            const element = restockOrders[0][i];
            var suppDetails = await this.connection.execute(q2, [element.suppID]);
            var prodDetails = await this.connection.execute(q3, [element.itemID]);
            var obj = {
                prodID: element.itemID,
                prodName: prodDetails[0][0].itemName,
                suppID: element.suppID,
                suppName: suppDetails[0][0].suppName,
                quantity: element.quantity
            }
            result.push(obj);
        }
        // console.log(result);
        return result;
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

    async getTempReStockDetails() {
        var result = [];
        var q1 = 'select * from temp_order_restock';
        var q2 = 'select name as itemName from products where item_code=?';
        var q3 = 'select name as suppName from suppliers where sup_id=?';
        var restockOrders = await this.connection.query(q1);
        // console.log(restockOrders[0]);
        for (let i = 0; i < restockOrders[0].length; i++) {
            const element = restockOrders[0][i];
            var itm = await this.connection.execute(q2, [element.itemID]);
            var supp = await this.connection.execute(q3, [element.suppID]);
            var obj = {
                orderID: element.orderID,
                itemName: itm[0][0].itemName,
                suppName: supp[0][0].suppName,
                quantity: element.quantity,
                amount: element.amount
            };
            result.push(obj);
        }
        return result;
    }

    async getTempOrderStockDetails() {
        var result = [];
        var q1 = 'select orderID,orderTime from temp_stock group by orderID';
        var stocks = await this.connection.query(q1);
        var q2 = 'select count(prodID) as itemCount from temp_stock where orderID=?';
        for (let i = 0; i < stocks[0].length; i++) {
            var element = stocks[0][i];
            var count = await this.connection.execute(q2, [element.orderID]);
            var obj = {
                orderID: element.orderID,
                itemCount: count[0][0].itemCount,
                time: element.orderTime
            }
            result.push(obj);
        }
        console.log(result);
        return result;
    }

    async getTempOrder(id) {
        var q1 = 'select prodID,quantity from temp_order where orderID=?';
        var items = await this.connection.execute(q1, [id]);
        var result = [];
        var q2 = 'select name,unit_price from products where item_code=?';
        for (let i = 0; i < items[0].length; i++) {
            const element = items[0][i];
            var r = await this.connection.execute(q2, [element.prodID]);
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

    async getTempReStockOrder(id) {
        var result = [];
        var q1 = 'select * from temp_order_restock where orderID=?';
        var q2 = 'select name as itemName from products where item_code=?';
        var q3 = 'select name as suppName from suppliers where sup_id=?';
        var restockOrders = await this.connection.execute(q1, [id]);
        const element = restockOrders[0][0];
        var itm = await this.connection.execute(q2, [element.itemID]);
        var supp = await this.connection.execute(q3, [element.suppID]);
        var obj = {
            orderID: element.orderID,
            itemName: itm[0][0].itemName,
            suppName: supp[0][0].suppName,
            quantity: element.quantity,
            amount: element.amount
        };
        result.push(obj);

        return result;
    }

    async getTempOrderStock(id) {
        var q1 = 'select prodID,quantity from temp_stock where orderID=?';
        var items = await this.connection.execute(q1, [id]);
        var result = [];
        var q2 = 'select name from products where item_code=?';
        var q3 = 'select store_location from stocks where item_code=?';
        for (let i = 0; i < items[0].length; i++) {
            const element = items[0][i];
            var r1 = await this.connection.execute(q2, [element.prodID]);
            var r2 = await this.connection.execute(q3, [element.prodID]);
            var obj = {
                itemID: element.prodID,
                itemName: r1[0][0].name,
                itemLocation: r2[0][0].store_location,
                itemQuantity: element.quantity
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
        console.log(result);
        return result;
    }


    async getProcessedOrders(type) {
        var q = '';
        if (type == '') {

        } else
            q = 'select order_no,order_date,sub_total from orderdetails where type=?';
        var result = await this.connection.execute(q, [type]);
        return result[0];
    }



    // * --------------------- CREATE OPERATIONS ---------------------------------

    async addItemToCart(itemCode, quantity) {
        var q = 'insert into cart(item_no,quantity) values(?,?)';
        const result = await this.connection.execute(q, [itemCode, quantity]);
        return result[0];
    }


    async createTempOrder() {
        var id = uuidv4();
        var q = 'insert into temp_order(orderID,prodID,quantity,orderTime) values(?,?,?,?)';
        var q2 = 'insert into temp_stock(orderID,prodID,quantity,orderTime) values(?,?,?,?)';
        var dateTime = this.#getCurrDateTime();
        var cartItems = await this.getCartDetails();
        for (var i = 0; i < cartItems.length; i++) {
            var result = await this.connection.execute(q, [id, cartItems[i].item_no, cartItems[i].quantity, dateTime]);
            var res2 = await this.connection.execute(q2, [id, cartItems[i].item_no, cartItems[i].quantity, dateTime]);
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

    // ! Requires modification when invetory orders are implemented---------------
    async createInventoryOrder(id) {
        var type = 'inventory';
        var q = 'select * from temp_order_restock where orderID=?';
        var order = await this.connection.execute(q, [id]);
        var q1 = 'insert into orderdetails(order_no,type,order_date,sub_total) values (?,?,?,?)';
        var q2 = 'insert into order_supplier(order_no,sup_id,product_id,quantity) values (?,?,?,?)';
        const element = order[0][0];
        var res1 = await this.connection.execute(q2, [id, element.suppID, element.itemID, element.quantity]);
        var date = this.#getCurrDateTime();
        var res2 = await this.connection.execute(q1, [id, type, date, parseInt(element.amount)]);
        var deleteItem = await this.deleteTempOrder(id);
        return res2[0];
    }

    async createTempRestockOrder(params) {
        var q = 'insert into temp_restock(itemID,suppID,quantity) values(?,?,?)';
        var result = await this.connection.execute(q, [params.id, params.suppID, params.quantity]);
        var q2 = 'update stocks set placed_Order=true where item_code=?';
        var res2 = await this.connection.execute(q2, [params.id]);
        return result[0];
    }

    async createTempRestockPayment(params) {
        var q1 = 'insert into temp_order_restock(orderID,suppID,itemID,quantity,amount) values(?,?,?,?,?)';
        var q2 = 'select unit_price from products where item_code=?';
        var q3 = 'select quantity from temp_restock where itemID=? && suppID=?';
        var q4 = 'select quantity from stocks where item_code=?'
        var id = uuidv4();
        var price = await this.connection.execute(q2, [params.itemID]);
        var quantity = await this.connection.execute(q3, [params.itemID, params.suppID]);
        var amount = parseFloat(price[0][0].unit_price) * parseFloat(quantity[0][0].quantity);
        var result = await this.connection.execute(q1, [id, params.suppID, params.itemID, quantity[0][0].quantity, amount]);
        var res2 = await this.deleteTempRestock(params.itemID, params.suppID);
        var res3 = await this.connection.execute(q4, [params.itemID]);
        var newQuantity = parseInt(quantity[0][0].quantity) + parseInt(res3[0][0].quantity);
        var updateStocks = await this.updateInventory(params.itemID, newQuantity);
        return result[0];
    }

    // *----------------------- UPDATE OPERATIONS --------------------------------

    async updateUserStatus(id, status) {
        var q = 'update users set status=? where user_id=?';
        const result = await this.connection.execute(q, [status, id]);
        return result[0];
    }

    async updateInventory(id, amount) {
        var q = 'update stocks set quantity=?,placed_Order=false where item_code=?';
        const result = await this.connection.execute(q, [amount, id]);
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

    async deleteTempRestock(item, supplier) {
        var q = 'delete from temp_restock where itemID=? && suppID=?';
        const result = await this.connection.execute(q, [item, supplier]);
        return result[0];
    }

    async deleteTempOrderStock(orderID) {
        var q1 = 'select prodID,quantity from temp_stock where orderID=?';
        var items = await this.connection.execute(q1, [orderID]);
        var q2 = 'select quantity from stocks where item_code=?';
        var q3 = 'update stocks set quantity=? where item_code=?';
        for (let i = 0; i < items[0].length; i++) {
            const element = items[0][i];
            var r1 = await this.connection.execute(q2, [element.prodID]);
            var newQuantity = parseInt(r1[0][0].quantity) - parseInt(element.quantity);
            var r2 = await this.connection.execute(q3, [newQuantity, element.prodID]);
        }
        var q4 = 'delete from temp_stock where orderID=?';
        var r3 = await this.connection.execute(q4, [orderID]);
        return r3[0];
    }

    async deleteTempRestockOrder(id) {
        var q = 'delete from temp_order_restock where orderID=?';
        var res = await this.connection.execute(q, [id]);
        return res[0];
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