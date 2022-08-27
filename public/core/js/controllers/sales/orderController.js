
const confirmOrder = document.getElementById('order_confirm');
const discardBtn = document.getElementById('discardOrder');
var cartItemsDeleteBtns = document.getElementsByClassName('deleteCartItem');
var cartItemsEditBtns = document.getElementsByClassName('editCartItem');

confirmOrder.addEventListener('click', async (event) => {
    const result = await axios.post('http://localhost:3000/NegomboHardware/sales/orders');
    console.log(result.data);
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

for (let i = 0; i < cartItemsEditBtns.length; i++) {
    const element = cartItemsEditBtns[i];
    element.addEventListener('click', async (event) => {

    });
}