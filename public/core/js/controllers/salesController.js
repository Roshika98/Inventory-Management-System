

const searchTxt = document.getElementById('searchTxt');
const searchSubmit = document.getElementById('prdSearch');
const dynamicContent = document.getElementById('dynamicContent');

console.log("Hello!");

searchSubmit.addEventListener('click', async (event) => {
    if (searchTxt.value) {
        var params = new URLSearchParams([['product', `${searchTxt.value}`]]);
        var result = await axios.get('http://localhost:3000/NegomboHardware/sales/products', { params });
        fillDynamicContent(result.data);
    }
});


function fillDynamicContent(data) {
    dynamicContent.innerHTML = data;
}