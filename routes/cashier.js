const express = require('express');
const router = express.Router();
const name = 'Cashier';


router.get('/home', (req, res) => {
    res.render('cashier/dashboard', { title: name, page: 'dashboard' });
});

module.exports = router;