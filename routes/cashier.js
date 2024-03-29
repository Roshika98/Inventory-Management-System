const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const name = 'Cashier';

const scriptPaths = {
    homepage: '/core/js/controllers/accounts/paymentController.js',
    account: '/core/js/controllers/accounts/accountController.js',
    order: '/core/js/controllers/accounts/processedOrderController.js'
}


router.get('', authMiddleware.isAuthCashier, (req, res) => {
    res.redirect('/NegomboHardware/cashier/home');
});

router.get('/home', authMiddleware.isAuthCashier, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var orderDetails = await database.getTempOrderDetails();
    var restockDetails = await database.getTempReStockDetails();
    res.render('partials/cashier/dashboard', { title: name, page: 'dashboard', orderDetails, restockDetails, userType, script: scriptPaths.homepage, user_name });
});

router.get('/billing', authMiddleware.isAuthCashier, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var orders = await database.getProcessedOrders('sales');
    console.log(orders);
    res.render('partials/cashier/processedOrders', { title: name, page: 'dashboard', orders, userType, script: scriptPaths.order, user_name });
});

router.get('/billing/:id', authMiddleware.isAuthCashier, async (req, res) => {
    var id = req.params.id;
    var items = await database.getTempOrder(id);
    res.render('partials/cashier/content/payment', { layout: false, items, orderID: id });
});

router.get('/billing/restock/:id', authMiddleware.isAuthCashier, async (req, res) => {
    var id = req.params.id;
    var items = await database.getTempReStockOrder(id);
    res.render('partials/cashier/content/payout', { layout: false, items, orderID: id });
});

router.get('/account', authMiddleware.isAuthCashier, async (req, res) => {
    var id = req.session.user_id;
    var { userType, user_name } = getUserDetails(req);
    var details = await database.getUserDetails(id);
    res.render('partials/sales/account', { title: name, page: 'Account', details: details, userType, script: scriptPaths.account, user_name });
});

// *------------------------------- POST REQUESTS ----------------------------------------------

router.post('/billing', authMiddleware.isAuthCashier, async (req, res) => {
    var params = req.body;
    var result = await database.createSalesOrder(params.orderID);
    res.send(result);
});

router.post('/billing/restock', authMiddleware.isAuthCashier, async (req, res) => {
    var params = req.body;
    console.log(params.orderID);
    var result = await database.createInventoryOrder(params.orderID);
    res.send(result);
});

// !------------------------BILLS------------------------------------

router.get('/customerOrder/:id', async (req, res) => {
    const order = await database.getCustomerBill(req.params.id);
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/userbill.ejs')), { orderID: req.params.id, order: order.order, items: order.itemDetails }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="bill.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.end(buffer);
});

router.get('/supplierOrder/:id', async (req, res) => {
    const order = await database.getSupplierBill(req.params.id);
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/supplierbill.ejs')), { order }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="bill.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.end(buffer);
});

module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}
