const express = require('express');
const router = express.Router();
const database = require('../database/database');
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Stocks';


const scriptPaths = {
    homepage: '/core/js/controllers/stocks/stockIssueController.js',
    inventory: '/core/js/controllers/stocks/inventoryController.js',
    order: '',
    account: '/core/js/controllers/accounts/accountController.js'
}

router.get('', authMiddleware.isAuthStocks, (req, res) => {
    res.redirect('/NegomboHardware/stocks/home');
});

router.get('/home', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var result = await database.getTempOrderStockDetails();
    res.render('partials/stocks/dashboard', { title: name, page: 'dashboard', userType, user_name, orderDetails: result, script: scriptPaths.homepage });
});

router.get('/account', authMiddleware.isAuthStocks, async (req, res) => {
    var id = req.session.user_id;
    var { userType, user_name } = getUserDetails(req);
    var details = await database.getUserDetails(id);
    res.render('partials/sales/account', { title: name, page: 'Account', details: details, userType, script: scriptPaths.account, user_name });
});

router.get('/orders', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var orders = await database.getProcessedOrders('inventory');
    res.render('partials/stocks/stockOrders', { title: name, page: 'dashboard', userType, user_name, orders, script: scriptPaths.order })
});

router.get('/inventory', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var items = await database.getInventoryItems(1);
    var restock = await database.getProdsToBeFilled();
    var restockOrders = await database.getTempRestockOrders();
    var newScenario = (res.locals.error && res.locals.error.length) || (res.locals.success && res.locals.success.length) ? true : false;
    res.render('partials/stocks/inventory', { userType, user_name, newScenario, title: name, items, restock, restockOrders, page: 'inventory', script: scriptPaths.inventory });
});

router.get('/inventory/issueItems', authMiddleware.isAuthStocks, async (req, res) => {
    var { orderID } = req.query;
    var result = await database.getTempOrderStock(orderID);
    console.log(result);
    res.render('partials/stocks/content/issueItems', { layout: false, orderID: orderID, items: result });
});

router.get('/inventory/restock', authMiddleware.isAuthStocks, async (req, res) => {
    var { itemID } = req.query;
    var result = await database.getRestockDetails(itemID);
    res.render('partials/stocks/content/restock', { layout: false, restock: result });
});

router.get('/inventory/editProduct/:id', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var product = await database.getProduct(req.params.id);
    console.log(product);
    res.render('partials/stocks/editProd', { userType, user_name, title: name, page: 'Edit Product', script: '', product });
});

router.get('/suppliers', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var suppliers = await database.getSupplierDetails();
    console.log(suppliers);
    res.render('partials/stocks/suppliers', { userType, user_name, title: name, suppliers, page: 'suppliers', script: '' });
});

// * ------------------------ POST REQUESTS ---------------------------------------------------


router.post('/inventory/issueItems', authMiddleware.isAuthStocks, async (req, res) => {
    var { orderID } = req.body;
    var result = await database.deleteTempOrderStock(orderID);
    res.sendStatus(200);
});

router.post('/restock', authMiddleware.isAuthStocks, async (req, res) => {
    var params = req.body;
    var result = await database.createTempRestockOrder(params);
    res.sendStatus(200);
});

router.post('/restock/onreceive', authMiddleware.isAuthStocks, async (req, res) => {
    var params = req.body;
    console.log(params);
    var result = await database.createTempRestockPayment(params);
    res.sendStatus(200);
});

router.post('/addProduct', authMiddleware.isAuthStocks, async (req, res) => {
    console.log(req.body);
    const result = await database.addNewProduct(req.body);
    if (result === 0) {
        req.flash('error', 'item already exists!');
        res.redirect('/NegomboHardware/stocks/inventory');
    } else {
        req.flash('success', 'item successfully added!');
        res.redirect('/NegomboHardware/stocks/inventory');
    }
});

router.post('/updateProduct/:id', authMiddleware.isAuthStocks, async (req, res) => {
    var result = await database.updateProduct(req.params.id, req.body);
    res.redirect('/NegomboHardware/stocks/inventory');
});

router.post('/addSupplier', authMiddleware.isAuthStocks, async (req, res) => {
    const result = await database.addSupplier(req.body);
    if (result === 0) {
        req.flash('error', 'Supplier already exists!');
        res.redirect('/NegomboHardware/stocks/suppliers');
    } else {
        req.flash('success', 'Supplier successfully added!');
        res.redirect('/NegomboHardware/stocks/suppliers');
    }
});



module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}
