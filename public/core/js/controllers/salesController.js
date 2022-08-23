

const searchTxt = document.getElementById('searchTxt');
const searchSubmit = document.getElementById('prdSearch');
const dynamicContent = document.getElementById('dynamicContent');

console.log("Hello!");

searchSubmit.addEventListener('click', async (event) => {
    if (searchTxt.value) {
        var params = new URLSearchParams([['product', `${searchTxt.value}`]]);
        try {
            var result = await axios.get('http://localhost:3000/NegomboHardware/sales/products', { params });
            fillDynamicContent(result.data);
        } catch (error) {
            var errorTerm = '<h4>Something went wrong :(</h4>';
            fillDynamicContent(errorTerm);
        }
    }
});


function fillDynamicContent(data) {
    dynamicContent.innerHTML = data;
}