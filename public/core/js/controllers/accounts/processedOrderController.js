const pageIndicator = document.getElementById('orderPage');
pageIndicator.classList.add('active');
pageIndicator.classList.add('bg-gradient-success');



var onOrderReceive = function updatePage() {
    console.log('function is called');
    displayOrderNotification('New Sales Order Received');
}