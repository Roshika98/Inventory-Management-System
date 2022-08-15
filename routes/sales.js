const express = require('express');
const router = express.Router();
const name = 'Sales';


router.get('', (req, res) => {
    res.redirect('/NegomboHardware/sales/home');
})

router.get('/home', (req, res) => {
    res.render('sales/dashboard', { title: name, page: 'dashboard' });
});

module.exports = router;