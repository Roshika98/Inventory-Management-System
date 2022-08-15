const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Cashier';


router.get('', authMiddleware.isAuthCashier, (req, res) => {
    res.redirect('/NegomboHardware/cashier/home');
});

router.get('/home', authMiddleware.isAuthCashier, (req, res) => {
    res.render('cashier/dashboard', { title: name, page: 'dashboard' });
});

module.exports = router;