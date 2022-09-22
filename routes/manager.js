const express = require('express');
const database = require('../database/database');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Manager';

const scriptPaths = {
    homepage: '',
    account: '',
    order: ''
}

router.get('', authMiddleware.isAuthManager, (req, res) => {
    res.redirect('/NegomboHardware/manager/home');
});

router.get('/home', authMiddleware.isAuthManager, (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    res.render('partials/manager/dashboard', { title: name, page: 'dashboard', userType, user_name, script: scriptPaths.homepage });
});


router.get('/completedOrders', authMiddleware.isAuthManager, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var salesOrders = await database.getProcessedOrders('sales');
    var inventoryOrders = await database.getProcessedOrders('inventory');
    res.render('partials/manager/processedOrders', { title: name, page: 'processed Orders', userType, user_name, salesOrders, inventoryOrders, script: '' });
});

router.get('/reports', authMiddleware.isAuthManager, async (req, res) => {
    var salesReport = await database.getMonthlySalesReport();
    console.log('Inventory Report');
    var inventoryReport = await database.getMonthlyInventoryReport();
    res.send("Hello");
});

module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}