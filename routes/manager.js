const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Manager';


router.get('', authMiddleware.isAuthManager, (req, res) => {
    res.redirect('/NegomboHardware/manager/home');
});

router.get('/home', authMiddleware.isAuthManager, (req, res) => {
    res.render('cashier/dashboard', { title: name, page: 'dashboard' });
});

module.exports = router;