const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const name = 'Sales';
const salesLayout = 'sales/layout';


router.get('', authMiddleware.isAuthSales, (req, res) => {
    res.redirect('/NegomboHardware/sales/home');
})

router.get('/home', authMiddleware.isAuthSales, (req, res) => {
    res.render('sales/partials/dashboard', { title: name, page: 'dashboard', layout: salesLayout });
});

router.get('/account', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    await database.getUserDetails(id);
    res.render('sales/partials/account', { title: name, page: 'Account', layout: salesLayout });
});

module.exports = router;