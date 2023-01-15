const pageIndicator = document.getElementById('orderPage');
pageIndicator.classList.add('active');
pageIndicator.classList.add('bg-gradient-success');



const confirmOrder = document.getElementById('order_confirm');
const discardBtn = document.getElementById('discardOrder');
const acknowledgeOrder = document.getElementById('acknowledgeOrder');
var cartItemsDeleteBtns = document.getElementsByClassName('deleteCartItem');
// var cartItemsEditBtns = document.getElementsByClassName('editCartItem');

confirmOrder.addEventListener('click', async (event) => {
    const result = await axios.post('http://localhost:3000/NegomboHardware/sales/orders');
    if (result.data[0])
        console.log('Accounts : ' + result.data[0].user_name);
    if (result.data[1])
        console.log('Stocks : ' + result.data[1].user_name);
    var params = prepareOrderNotificationData(result.data);
    triggerOrderNotification(params);
    acknowledgeOrder.click();
});


discardBtn.addEventListener('click', async (event) => {
    const reuslt = await axios.delete('http://localhost:3000/NegomboHardware/sales/orders');
    window.location = 'http://localhost:3000/NegomboHardware/sales/orders';
});

for (let i = 0; i < cartItemsDeleteBtns.length; i++) {
    const element = cartItemsDeleteBtns[i];
    element.addEventListener('click', async (event) => {
        var id = element.getAttribute('data-itemID');
        try {
            var result = await axios.delete(`http://localhost:3000/NegomboHardware/sales/orders/${id}`);
            window.location = 'http://localhost:3000/NegomboHardware/sales/orders';
        } catch (error) {

        }
    });
}

// for (let i = 0; i < cartItemsEditBtns.length; i++) {
//     const element = cartItemsEditBtns[i];
//     element.addEventListener('click', async (event) => {

//     });
// }


function prepareOrderNotificationData(data) {
    var params = {
        accountant: data[0] ? data[0].user_name : null,
        stocks: data[1] ? data[1].user_name : null
    }
    return params;
}