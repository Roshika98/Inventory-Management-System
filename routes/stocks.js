const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Stocks';


router.get('', authMiddleware.isAuthStocks, (req, res) => {
    res.redirect('/NegomboHardware/stocks/home');
});

router.get('/home', authMiddleware.isAuthStocks, (req, res) => {
    var userType = req.session.user_type;
    res.render('partials/stocks/dashboard', { title: name, page: 'dashboard', userType });
});

module.exports = router;