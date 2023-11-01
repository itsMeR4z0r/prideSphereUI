const qrcodeModal = new bootstrap.Modal(document.getElementById('qrcodeModal'));
let timer = null;
let reqSes = null;
$(document).ready(function() {
    $(window).keydown(function(event){
        if(event.keyCode === 13) {
            event.preventDefault();
            login();
            return false;
        }
    });
    document.getElementById('qrcodeModal').addEventListener('hidden.bs.modal', event => {
        clearInterval(timer);
    });
});
function login() {
    document.getElementById("qrcode").src = '';
    var email = document.getElementById("email").value;
    var data = {
        email: email, requestId: document.getElementById("requestID").value
    };
    $.ajax({
        type: "POST", url: "/login", data: data, success: function (response) {
            if (response.success) {
                reqSes = response;
                document.getElementById("qrcode").src = 'data:image/png;base64,' + response.qrcode;
                qrcodeModal.show();
                timer = setInterval(checkLogin, 2000);
            } else {
                alert("Invalid Credentials");
            }
        }
    });
    return false;
}



function checkLogin() {
    const data = {
        sid: reqSes.sid
    };
    $.ajax({
        type: "POST", url: "/qrcode/check", data: data, success: function (response) {
            console.log(response);
            if (response.success) {
                clearInterval(timer);
                window.location.href = "/dashboard";
            }
        }
    });
}