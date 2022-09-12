const express = require('express');
const router = express.Router();
const database = require('../database/database');
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Stocks';


const scriptPaths = {
    homepage: '/core/js/controllers/stocks/stockIssueController.js',
    account: '/core/js/controllers/stocks/accountController.js',
    order: ''
}

router.get('', authMiddleware.isAuthStocks, (req, res) => {
    res.redirect('/NegomboHardware/stocks/home');
});

router.get('/home', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var result = await database.getTempOrderStockDetails();
    res.render('partials/stocks/dashboard', { title: name, page: 'dashboard', userType, user_name, orderDetails: result, script: scriptPaths.homepage });
});

router.get('/orders', authMiddleware.isAuthStocks, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var orders = await database.getProcessedOrders('inventory');
    res.render('partials/stocks/stockOrders', { title: name, page: 'dashboard', userType, user_name, orders, script: scriptPaths.order })
});


module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}
