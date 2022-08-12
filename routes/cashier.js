const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    res.render('cashier/dashboard');
});

module.exports = router;