const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Cashier';


router.get('', authMiddleware.isAuthCashier, (req, res) => {
    res.redirect('/NegomboHardware/cashier/home');
});

router.get('/home', authMiddleware.isAuthCashier, (req, res) => {
    var userType = req.session.user_type;
    res.render('partials/cashier/dashboard', { title: name, page: 'dashboard', userType });
});

module.exports = router;