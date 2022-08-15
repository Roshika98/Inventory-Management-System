const express = require('express');
const router = express.Router();


router.get('', (req, res) => {
    res.redirect('NegomboHardware/login');
});

router.get('/login', (req, res) => {
    res.render('default/login', { layout: false });
});


router.post('/login', (req, res) => {

});

module.exports = router;