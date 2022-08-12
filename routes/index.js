const express = require('express');
const cashierRouter = require('./cashier');
const salesRouter = require('./sales');

const Router = {
    cashier: cashierRouter,
    sales: salesRouter
};

module.exports = Router;