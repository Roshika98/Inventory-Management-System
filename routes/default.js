const express = require('express');
const router = express.Router();
const authentication = require('../security/authentication');


router.get('', (req, res) => {
    res.redirect('NegomboHardware/login');
});

router.get('/login', (req, res) => {
    res.render('default/login', { layout: false });
});

router.get('/logout', (req, res) => {
    authentication.deserializeUser(req);
    res.redirect('/NegomboHardware/login');
});


router.post('/login', async (req, res) => {
    var { username, pass } = req.body;
    const result = await authentication.login(username, pass);
    console.log(result);
    if (result.isValid) {
        authentication.serializeUser(req, result.id, result.type);
        req.flash('success', 'Logged in successfully!');
        if (result.type === 'salesman') {
            res.redirect('/NegomboHardware/sales');
        } else if (result.type === 'cashier') {
            res.redirect('/NegomboHardware/cashier');
        }
    } else {
        req.flash('error', 'username or password is incorrect!');
        res.redirect('/NegomboHardware/login');
    }
});



module.exports = router;