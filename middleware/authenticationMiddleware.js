

const isAuthSales = (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.user_type === 'salesman') {
            next();
        } else {
            res.redirect('/NegomboHardware/login');
        }
    } else {
        res.redirect('/NegomboHardware/login');
    }
};


const isAuthCashier = (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.user_type === 'cashier') {
            next();
        } else {
            res.redirect('/NegomboHardware/login');
        }
    } else {
        res.redirect('/NegomboHardware/login');
    }
};


const isAuthManager = (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.user_type === 'manager') {
            next();
        } else {
            res.redirect('/NegomboHardware/login');
        }
    } else {
        res.redirect('/NegomboHardware/login');
    }
};


const isAuthStocks = (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.user_type === 'stockM') {
            next();
        } else {
            res.redirect('/NegomboHardware/login');
        }
    } else {
        res.redirect('/NegomboHardware/login');
    }
};




module.exports = { isAuthSales, isAuthCashier, isAuthManager, isAuthStocks };