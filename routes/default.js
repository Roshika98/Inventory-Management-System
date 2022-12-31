const express = require('express');
const database = require('../database/database');
const router = express.Router();
const authentication = require('../security/authentication');


router.get('', (req, res) => {
    res.redirect('NegomboHardware/login');
});

router.get('/login', (req, res) => {
    res.render('default/loginNew', { layout: false });
});

router.get('/logout', async (req, res) => {
    const result = await database.updateUserStatus(req.session.user_id, false);
    authentication.deserializeUser(req);
    res.redirect('/NegomboHardware/login');
});


router.post('/login', async (req, res) => {
    var { username, pass } = req.body;
    const result = await authentication.login(username, pass);
    if (result.isValid) {
        authentication.serializeUser(req, result.id, result.type, username);
        const status = await database.updateUserStatus(req.session.user_id, true);
        req.flash('success', '      Logged in successfully!');
        if (result.type === 'Salesman') {
            res.redirect('/NegomboHardware/sales/home');
        } else if (result.type === 'Accountant') {
            res.redirect('/NegomboHardware/cashier/home');
        } else if (result.type === 'Manager') {
            res.redirect('/NegomboHardware/manager/home');
        } else if (result.type === 'StockHandler') {
            res.redirect('/NegomboHardware/stocks/home');
        }
    } else {
        req.flash('error', '    username or password is incorrect!');
        res.redirect('/NegomboHardware/login');
    }
});

router.post('/changePassword', async (req, res) => {
    console.log(req.body);
    res.send('got');
});



module.exports = router;