const express = require('express');
const cashierRouter = require('./cashier');
const salesRouter = require('./sales');
const defaultRouter = require('./default');
const managerRouter = require('./manager');
const stocksRouter = require('./stocks');

const Router = {
    default: defaultRouter,
    cashier: cashierRouter,
    sales: salesRouter,
    manager: managerRouter,
    stocks: stocksRouter
};

module.exports = Router;