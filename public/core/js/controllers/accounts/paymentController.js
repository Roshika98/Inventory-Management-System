const paymentModalContent = document.getElementById('modalContentPay');
const paymentModal = document.getElementById('processPayment');
const toggleModal = document.getElementById('togglePaymentModal');
var processOrders = document.getElementsByClassName('processOrder');
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