const paymentModalContent = document.getElementById('modalContentPay');
const toggleModal = document.getElementById('acknowledgePayment');
var processOrders = document.getElementsByClassName('processOrder');

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
}