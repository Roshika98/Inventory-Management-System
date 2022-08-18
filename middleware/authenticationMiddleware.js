

const isAuthSales = (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.user_type === 'Salesman') {
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
        if (req.session.user_type === 'Accountant') {
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
        if (req.session.user_type === 'Manager') {
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
        if (req.session.user_type === 'StockHandler') {
            next();
        } else {
            res.redirect('/NegomboHardware/login');
        }
    } else {
        res.redirect('/NegomboHardware/login');
    }
};




module.exports = { isAuthSales, isAuthCashier, isAuthManager, isAuthStocks };