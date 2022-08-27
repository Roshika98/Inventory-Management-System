const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const name = 'Sales';

const scriptPaths = {
    homepage: '/core/js/controllers/sales/salesController.js',
    account: '',
    order: '/core/js/controllers/sales/orderController.js'
}

router.get('', authMiddleware.isAuthSales, (req, res) => {
    res.redirect('/NegomboHardware/sales/home');
})

router.get('/home', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    var userType = req.session.user_type;
    var { user_name } = await database.getUserName(id);
    res.render('partials/sales/dashboard', { title: name, page: 'dashboard', user_name, userType, script: scriptPaths.homepage });
});

router.get('/account', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    var details = await database.getUserDetails(id);
    res.render('partials/sales/account', { title: name, page: 'Account', details: details, userType, script: scriptPaths.account, user_name });
});

router.get('/products', authMiddleware.isAuthSales, async (req, res) => {
    var params = req.query.product;
    var result = await database.searchForProducts(params);
    console.log(result);
    res.render('partials/sales/content/searchedProds', { layout: false, products: result });
});

router.get('/orders', authMiddleware.isAuthSales, async (req, res) => {
    var orders = await database.getTempCustOrders();
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    var result = await database.getOrderItemsDetails(orders);
    res.render('partials/sales/order', { title: name, page: 'Order', items: result, userType, user_name, script: scriptPaths.order });
});


// * ------------------------------------- POST REQUESTS -------------------------------------

router.post('/cart', authMiddleware.isAuthSales, async (req, res) => {
    var params = req.body;
    console.log(params);
    var createOrder = await database.addTempItem(params.itemCode, params.quantity);
    res.sendStatus(200);
});

router.post('/orders', authMiddleware.isAuthSales, async (req, res) => {
    var personell = await database.getOrderHandlingPersonell('Accountant', 'StockHandler');
    res.send(personell);
});

// *------------------------------------- DELETE REQUESTS ------------------------------------

router.delete('/orders/:id', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.params.id;
    var result = await database.deleteCartItem(id);
    res.send(result);
});

router.delete('/orders', authMiddleware.isAuthSales, async (req, res) => {
    var result = await database.deleteCurrCart();
    res.send(result);
});

module.exports = router;