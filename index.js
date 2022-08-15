if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = require('./routes');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mysql2 = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);
const flashMiddleware = require('./middleware/flashMiddleware');

//* Parameters for the server-----------------------

const app = express();
const port = 3000;

//* utility settings --------------------------------------

const dpParameters = {
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME
};

const sessionOptions = {
    clearExpired: true,
    checkExpirationInterval: 900000,
    createDatabaseTable: true
};

const connection = mysql2.createPool(dpParameters);
const sessionStore = new MySQLStore(sessionOptions, connection);

const userSession = {
    secret: process.env.SESSION_SECRET || 'Session Secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    }
};


app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


app.use(session(userSession), flash(), flashMiddleware);
app.use('/NegomboHardware/sales', router.sales);
app.use('/NegomboHardware/cashier', router.cashier);
app.use('/NegomboHardware', router.default);


app.listen(port, () => {
    console.log('Listening on port ', port);
});