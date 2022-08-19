const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const name = 'Manager';


router.get('', authMiddleware.isAuthManager, (req, res) => {
    res.redirect('/NegomboHardware/manager/home');
});

router.get('/home', authMiddleware.isAuthManager, (req, res) => {
    var userType = req.session.user_type;
    res.render('partials/cashier/dashboard', { title: name, page: 'dashboard', userType });
});

module.exports = router;