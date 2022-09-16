
var stockOrders = document.getElementsByClassName('stockOrder');
var triggermodal = document.getElementById('issueItemModal');
var modalContent = document.getElementById('issueStockBody');
var confirmItemIssue = document.getElementById('issueStockConfirm');

for (let i = 0; i < stockOrders.length; i++) {
    const element = stockOrders[i];
    element.addEventListener('click', async (e) => {
        var id = element.getAttribute('data-orderID');
        var params = new URLSearchParams([['orderID', `${id}`]]);
        try {
            var result = await axios.get('http://localhost:3000/NegomboHardware/stocks/inventory/issueItems', { params });
            setUpDynamicContent(result.data);
            triggermodal.click();
        } catch (error) {
            var errorTerm = '<h4>Something went wrong :(</h4>';
            // setUpDynamicContent(errorTerm);
        }
    });
}

confirmItemIssue.addEventListener('click', async (e) => {
    var id = document.getElementById('orderID').getAttribute('data-orderID');
    var obj = {
        orderID: id
    }
    try {
        var params = JSON.stringify(obj);
        var response = await axios.post('http://localhost:3000/NegomboHardware/stocks/inventory/issueItems', params,
            { headers: { 'Content-Type': 'application/json', } });
        window.location = 'http://localhost:3000/NegomboHardware/stocks/home';
    } catch (error) {

    }
});

function setUpDynamicContent(data) {
    modalContent.innerHTML = data;
}


var onStockRequest = function updatePage() {
    console.log('function is called');
    // if (!paymentModal.classList.contains('show')) {
    alert('New stock issue order');
    window.location = 'http://localhost:3000/NegomboHardware/stocks/home';
    // } else {
    // console.log('modal is open');
    // }
}

