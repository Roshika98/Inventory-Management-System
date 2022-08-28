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
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ioUsers = require('./utility/realtimeNotify');

//* Parameters for the server-----------------------


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
app.use('/NegomboHardware/manager', router.manager);
app.use('/NegomboHardware/stocks', router.stocks);
app.use('/NegomboHardware/sales', router.sales);
app.use('/NegomboHardware/cashier', router.cashier);
app.use('/NegomboHardware', router.default);




server.listen(port, () => {
    console.log('Listening on port ', port);
});



io.on('connection', (client) => {
    client.on('register', (data) => {
        console.log(data + " registered..");
        client.join(data);
    });
    client.on('order', (data) => {
        if (data.accountant)
            client.in(data.accountant).emit('updateOnOrder', 'order received');
        if (data.stocks)
            client.in(data.stocks).emit('releaseItems', 'Fetch items');
    });

});
