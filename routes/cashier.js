const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const name = 'Cashier';


router.get('', authMiddleware.isAuthCashier, (req, res) => {
    res.redirect('/NegomboHardware/cashier/home');
});

router.get('/home', authMiddleware.isAuthCashier, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    res.render('partials/cashier/dashboard', { title: name, page: 'dashboard', userType, script: '', user_name });
});

router.get('/billing', authMiddleware.isAuthCashier, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    res.render('partials/cashier/bill', { title: name, page: 'dashboard', userType, script: '', user_name });
});

module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}
