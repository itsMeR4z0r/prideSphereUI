const qrcodeModal = new bootstrap.Modal(document.getElementById('qrcodeModal'));
const requestId = self.crypto.randomUUID();
let timer = null;

function login() {
    document.getElementById("qrcode").src = '';
    var email = document.getElementById("email").value;
    var data = {
        email: email, requestId: requestId
    };
    $.ajax({
        type: "POST", url: "/login", data: data, success: function (response) {
            if (response.success) {
                document.getElementById("qrcode").src = 'data:image/png;base64,' + response.qrcode;
                qrcodeModal.show();
                timer = setInterval(checkLogin, 2000);
            } else {
                alert("Invalid Credentials");
            }
        }
    });
}
qrcodeModal.addEventListener('hidden.bs.modal', event => {
    clearInterval(timer);
})

function checkLogin() {
    const data = {
        requestId: requestId
    };
    $.ajax({
        type: "POST", url: "/qrcode/check", data: data, success: function (response) {
            if (response.success) {
                clearInterval(timer);
                $.cookie('requestId', requestId, {expires: 1, path: '/'});
                window.location.href = "/dashboard";
            }
        }
    });
}