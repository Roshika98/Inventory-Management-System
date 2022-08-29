const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const name = 'Cashier';

const scriptPaths = {
    homepage: '/core/js/controllers/accounts/paymentController.js',
    account: '',
    order: ''
}


router.get('', authMiddleware.isAuthCashier, (req, res) => {
    res.redirect('/NegomboHardware/cashier/home');
});

router.get('/home', authMiddleware.isAuthCashier, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var orderDetails = await database.getTempOrderDetails();
    res.render('partials/cashier/dashboard', { title: name, page: 'dashboard', orderDetails, userType, script: scriptPaths.homepage, user_name });
});

router.get('/billing', authMiddleware.isAuthCashier, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    res.render('partials/cashier/bill', { title: name, page: 'dashboard', userType, script: '', user_name });
});

router.get('/billing/:id', authMiddleware.isAuthCashier, async (req, res) => {
    var id = req.params.id;
    var items = await database.getTempOrder(id);
    res.render('partials/cashier/content/payment', { layout: false, items, orderID: id });
});




module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}
