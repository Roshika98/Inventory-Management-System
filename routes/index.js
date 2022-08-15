const express = require('express');
const cashierRouter = require('./cashier');
const salesRouter = require('./sales');
const defaultRouter = require('./default');

const Router = {
    default: defaultRouter,
    cashier: cashierRouter,
    sales: salesRouter
};

module.exports = Router;