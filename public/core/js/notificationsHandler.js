var socket = null;

const username = document.getElementById('sidenav-main').getAttribute('data-username');

notifications = {
    misc: {
        navbar_menu_visible: 0
    },

    showNotification: function (options) {
        color = options.colorTheme;

        $.notify({
            icon: options.icon,
            message: options.message

        }, {
            type: color,
            timer: options.timer,
            placement: {
                from: options.from,
                align: options.align
            },
            clickToHide: true
        });
    }
};


function notifySuccess() {
    try {
        var succes = document.getElementById('message').getAttribute('data-msg');
        var opt = {
            from: 'top',
            align: 'center',
            colorTheme: 'success',
            message: succes,
            timer: 800,
            icon: 'fa fa-check'
        };
        notifications.showNotification(opt);
    } catch (error) {
        console.log(error);
    }
}


function notifyError() {
    try {
        var error = document.getElementById('error-message').getAttribute('data-msg');
        var opt = {
            from: 'top',
            align: 'center',
            colorTheme: 'danger',
            message: error,
            timer: 800,
            icon: 'fa fa-exclamation-triangle'
        };
        notifications.showNotification(opt);
    } catch (error) {
        console.log(error);
    }
}

function notifyWarning() {
    try {
        var warning = document.getElementById('warning-message').getAttribute('data-msg');
        var opt = {
            from: 'top',
            align: 'center',
            colorTheme: 'warning',
            message: warning,
            timer: 800,
            icon: 'fa fa-exclamation'
        };
        notifications.showNotification(opt);
    } catch (error) {
        console.log(error);
    }
}


var displayOrderNotification = function notifyOrderInfo(msg) {
    try {
        var opt = {
            from: 'top',
            align: 'center',
            colorTheme: 'info',
            message: msg,
            timer: 800,
            icon: 'fa fa-bell'
        };
        notifications.showNotification(opt);
    } catch (error) {
        console.log(error);
    }
}


socket = io.connect('http://localhost:3000');
socket.on('connect', (data) => {
    socket.emit('register', username);
});
socket.on('updateOnOrder', (data) => {
    console.log("Event acquired");
    onOrderReceive();
});
socket.on('releaseItems', (data) => {
    console.log('Stock release event acquired');
    onStockRequest();
});


var triggerOrderNotification = function NotifyOrder(data) {
    socket.emit('order', { accountant: data.accountant, stockHandler: data.stocks });
}


notifySuccess();
notifyError();
notifyWarning();