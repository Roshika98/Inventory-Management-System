var restockmodal = document.getElementById('restockbody');
var triggermodal = document.getElementById('restockModal');
var restockItems = document.getElementsByClassName('restockItem');
var restockOrders = document.getElementsByClassName('restockOrders');
var confirmrestock = document.getElementById('restockConfirm');


confirmrestock.addEventListener('click', async (e) => {
    var itemID = document.getElementById('prodID').getAttribute('data-itemID');
    var supplierID = document.getElementById('supplier').value;
    var quantity = document.getElementById('prodQuantity').value;
    var obj = {
        id: itemID,
        suppID: supplierID,
        quantity: quantity
    };
    try {
        var params = JSON.stringify(obj);
        var response = await axios.post('http://localhost:3000/NegomboHardware/stocks/restock', params,
            { headers: { 'Content-Type': 'application/json', } });
        window.location = 'http://localhost:3000/NegomboHardware/stocks/inventory';
    } catch (error) {

    }
});


for (let i = 0; i < restockItems.length; i++) {
    const element = restockItems[i];
    element.addEventListener('click', async (e) => {
        var id = element.getAttribute('data-itemID');
        var params = new URLSearchParams([['itemID', `${id}`]]);
        try {
            var result = await axios.get('http://localhost:3000/NegomboHardware/stocks/inventory/restock', { params });
            setUpDynamicContent(result.data);
            triggermodal.click();
        } catch (error) {
            var errorTerm = '<h4>Something went wrong :(</h4>';
            // setUpDynamicContent(errorTerm);
        }
    });
}

for (let i = 0; i < restockOrders.length; i++) {
    const element = restockOrders[i];
    element.addEventListener('click', async (e) => {
        var obj = {
            itemID: element.getAttribute('data-itemID'),
            suppID: element.getAttribute('data-suppID')
        }
        try {
            var params = JSON.stringify(obj);
            var response = await axios.post('http://localhost:3000/NegomboHardware/stocks/restock/onreceive', params,
                { headers: { 'Content-Type': 'application/json', } });
            window.location = 'http://localhost:3000/NegomboHardware/stocks/inventory';
        } catch (error) {

        }
    });
}


function setUpDynamicContent(data) {
    restockmodal.innerHTML = data;
}