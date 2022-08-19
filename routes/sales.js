const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const name = 'Sales';



router.get('', authMiddleware.isAuthSales, (req, res) => {
    res.redirect('/NegomboHardware/sales/home');
})

router.get('/home', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    var userType = req.session.user_type;
    var { user_name } = await database.getUserName(id);
    res.render('partials/sales/dashboard', { title: name, page: 'dashboard', user_name, userType });
});

router.get('/account', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    var userType = req.session.user_type;
    var details = await database.getUserDetails(id);
    res.render('partials/sales/account', { title: name, page: 'Account', details: details, userType });
});

module.exports = router;