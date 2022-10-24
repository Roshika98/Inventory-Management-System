const pageIndicator = document.getElementById('homepage');
pageIndicator.classList.add('active');
pageIndicator.classList.add('bg-gradient-success');


const paymentModalContent = document.getElementById('modalContentPay');
const paymentModal = document.getElementById('processPayment');
const toggleModal = document.getElementById('togglePaymentModal');
var processOrders = document.getElementsByClassName('processOrder');
const payoutModalContent = document.getElementById('payoutContent');
const payoutModal = document.getElementById('payout');
const togglePayout = document.getElementById('togglePayout');
var processPayouts = document.getElementsByClassName('processPayout');

var orderConfirmed = null;
var acceptPayment = null;

onOrder.accounts = onOrderReceive;


for (let i = 0; i < processOrders.length; i++) {
    const element = processOrders[i];
    element.addEventListener('click', async (event) => {
        var id = element.getAttribute('data-itemID');
        var data = await axios.get(`http://localhost:3000/NegomboHardware/cashier/billing/${id}`);
        fillPaymentModal(data.data);
        toggleModal.click();
    });
}

for (let i = 0; i < processPayouts.length; i++) {
    const element = processPayouts[i];
    element.addEventListener('click', async (event) => {
        var id = element.getAttribute('data-itemID');
        var data = await axios.get(`http://localhost:3000/NegomboHardware/cashier/billing/restock/${id}`);
        fillPayoutModal(data.data);
        togglePayout.click();
    });
}


function fillPaymentModal(data) {
    paymentModalContent.innerHTML = data;
    orderConfirmed = document.getElementById('confirmed');
    acceptPayment = document.getElementById('acceptPayment');
    acceptPayment.addEventListener('click', async (event) => {
        var id = acceptPayment.getAttribute('data-orderID');
        var params = {
            orderID: id
        };
        body = JSON.stringify(params);
        var result = await axios.post('http://localhost:3000/NegomboHardware/cashier/billing', body,
            { headers: { 'Content-Type': 'application/json' } });
        orderConfirmed.click();
        var bill = document.getElementById('report');
        bill.setAttribute('href', `http://localhost:3000/NegomboHardware/cashier/customerOrder/${result.data}`);
        bill.click();
        window.location = 'http://localhost:3000/NegomboHardware/cashier/home';
    });
}

function fillPayoutModal(data) {
    payoutModalContent.innerHTML = data;
    orderConfirmed = document.getElementById('confirmed');
    acceptPayout = document.getElementById('acceptPayout');
    acceptPayout.addEventListener('click', async (event) => {
        var id = acceptPayout.getAttribute('data-orderID');
        var params = {
            orderID: id
        };
        body = JSON.stringify(params);
        var result = await axios.post('http://localhost:3000/NegomboHardware/cashier/billing/restock', body,
            { headers: { 'Content-Type': 'application/json' } });
        orderConfirmed.click();
        var bill = document.getElementById('report');
        bill.setAttribute('href', `http://localhost:3000/NegomboHardware/cashier/supplierOrder/${result.data}`);
        bill.click();
        window.location = 'http://localhost:3000/NegomboHardware/cashier/home';
    });
}

var onOrderReceive = function updatePage() {
    console.log('function is called');
    if (!paymentModal.classList.contains('show')) {
        window.location = 'http://localhost:3000/NegomboHardware/cashier/home';
    } else {
        console.log('modal is open');
    }
}