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


socket = io.connect('http://localhost:3000');
socket.on('connect', (data) => {
    // alert('connected');
    socket.emit('register', username);
});
socket.on('updateOnOrder', (data) => {
    alert(data);
});


function NotifyCashier() {
    socket.emit('order', 'Emilio79');
}


notifySuccess();
notifyError();
notifyWarning();