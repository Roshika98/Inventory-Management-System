const pageIndicator = document.getElementById('homePage');
pageIndicator.classList.add('active');
pageIndicator.classList.add('bg-gradient-success');


const searchTxt = document.getElementById('searchTxt');
const searchSubmit = document.getElementById('prdSearch');
const dynamicContent = document.getElementById('dynamicContent');

console.log("Hello!");

searchSubmit.addEventListener('click', async (event) => {
    if (searchTxt.value) {
        var params = new URLSearchParams([['product', `${searchTxt.value}`]]);
        try {
            var result = await axios.get('http://localhost:3000/NegomboHardware/sales/products', { params });
            setUpDynamicContent(result.data);
        } catch (error) {
            var errorTerm = '<h4>Something went wrong :(</h4>';
            setUpDynamicContent(errorTerm);
        }
    }
});


function setUpDynamicContent(data) {
    dynamicContent.innerHTML = data;
    itemCart();
}

function itemCart() {
    var cartBtns = document.getElementsByClassName('itemCart');
    console.log(cartBtns.length);
    for (let i = 0; i < cartBtns.length; i++) {
        const element = cartBtns[i];
        element.addEventListener('click', async (event) => {
            var item_code = element.getAttribute('data-itemCode');
            var parent = element.parentNode;
            var quantity = parent.querySelector('input').value;
            var max = parseInt(parent.querySelector('input').getAttribute('max'));
            if (quantity <= 0) {
                customNotification.displayNotification('Quantity must be greater than 0', 'warning');
                return;
            } else if (quantity > max) {
                customNotification.displayNotification('Quantity exceeds current stock amount', 'danger');
                return;
            }
            var params = JSON.stringify(prepareBody(item_code, quantity));
            var response = await axios.post('http://localhost:3000/NegomboHardware/sales/cart', params,
                { headers: { 'Content-Type': 'application/json', } });
            window.location = 'http://localhost:3000/NegomboHardware/sales/home'
            console.log(response.data);
        });
    }
}


function prepareBody(item_code, quantity) {
    const request = {
        itemCode: item_code,
        quantity: quantity
    }
    return request;
}

