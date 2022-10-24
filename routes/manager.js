const express = require('express');
const database = require('../database/database');
const router = express.Router();
const authMiddleware = require('../middleware/authenticationMiddleware');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const name = 'Manager';

const scriptPaths = {
    homepage: '',
    account: '',
    order: ''
}

router.get('', authMiddleware.isAuthManager, (req, res) => {
    res.redirect('/NegomboHardware/manager/home');
});

router.get('/home', authMiddleware.isAuthManager, (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    res.render('partials/manager/dashboard', { title: name, page: 'dashboard', userType, user_name, script: scriptPaths.homepage });
});


router.get('/completedOrders', authMiddleware.isAuthManager, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    var salesOrders = await database.getProcessedOrders('sales');
    var inventoryOrders = await database.getProcessedOrders('inventory');
    res.render('partials/manager/processedOrders', { title: name, page: 'processed Orders', userType, user_name, salesOrders, inventoryOrders, script: '' });
});

router.get('/reports', authMiddleware.isAuthManager, async (req, res) => {
    var { userType, user_name } = getUserDetails(req);
    // var salesReport = await database.getMonthlySalesReport();
    // console.log('Inventory Report');
    // var inventoryReport = await database.getMonthlyInventoryReport();
    // res.send("Hello");
    res.render('partials/manager/stats', { title: name, page: 'Reports', userType, user_name, script: '' });
});

// *------------------------REPORTS--------------------------------------------


router.get('/salesReport', async (req, res) => {
    var sales = await database.getMonthlySalesReport();
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/salesreport.ejs')), { sales }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="salesReport.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "letter", landscape: true });
    await browser.close();
    res.end(buffer);
});


router.get('/inventoryReport', async (req, res) => {
    var inventory = await database.getMonthlyInventoryReport();
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/inventoryreport.ejs')), { inventory }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="inventoryReport.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "letter", landscape: true });
    await browser.close();
    res.end(buffer);
});

router.get('/finantialReport', async (req, res) => {
    const finance = await database.getFinantialReport();
    // console.log(finance);
    // res.send('hello');
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/finantialreport.ejs')), { finance }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="finantialReport.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "letter", landscape: true });
    await browser.close();
    res.end(buffer);
});

module.exports = router;

function getUserDetails(req) {
    var userType = req.session.user_type;
    var user_name = req.session.user_name;
    return { userType, user_name };
}