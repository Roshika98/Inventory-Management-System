const express = require('express');
const router = require('./routes');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = 3000;


app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));



app.use('/NegomboHardware/sales', router.sales);
app.use('/NegomboHardware/cashier', router.cashier);
app.use('/NegomboHardware', router.default);


app.listen(port, () => {
    console.log('Listening on port ', port);
});