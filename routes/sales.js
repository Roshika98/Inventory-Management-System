const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const database = require('../database/database');
const name = 'Sales';

const scriptPaths = {
    homepage: '/core/js/controllers/salesController.js',
    account: ''
}

router.get('', authMiddleware.isAuthSales, (req, res) => {
    res.redirect('/NegomboHardware/sales/home');
})

router.get('/home', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    var userType = req.session.user_type;
    var { user_name } = await database.getUserName(id);
    res.render('partials/sales/dashboard', { title: name, page: 'dashboard', user_name, userType, script: scriptPaths.homepage });
});

router.get('/account', authMiddleware.isAuthSales, async (req, res) => {
    var id = req.session.user_id;
    var userType = req.session.user_type;
    var details = await database.getUserDetails(id);
    res.render('partials/sales/account', { title: name, page: 'Account', details: details, userType, script: scriptPaths.account });
});

router.get('/products', authMiddleware.isAuthSales, async (req, res) => {
    var params = req.query.product;
    var result = await database.searchForProducts(params);
    console.log(result);
    res.render('partials/sales/content/searchedProds', { layout: false, products: result });
});

module.exports = router;