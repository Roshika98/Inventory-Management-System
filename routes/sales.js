const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Sales';


router.get('', authMiddleware.isAuthSales, (req, res) => {
    res.redirect('/NegomboHardware/sales/home');
})

router.get('/home', authMiddleware.isAuthSales, (req, res) => {
    res.render('sales/dashboard', { title: name, page: 'dashboard' });
});

module.exports = router;