const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Stocks';


router.get('', authMiddleware.isAuthStocks, (req, res) => {
    res.redirect('/NegomboHardware/stocks/home');
});

router.get('/home', authMiddleware.isAuthStocks, (req, res) => {
    res.render('stocks/dashboard', { title: name, page: 'dashboard' });
});

module.exports = router;