// This method will trigger user permissions
let cameraId = $.cookie('camera');
const html5QrCode = new Html5Qrcode(/* element id */ "qr-reader");
Html5Qrcode.getCameras().then(devices => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */

    if (devices && devices.length) {
        for (let i = 0; i < devices.length; i++) {
            let device = devices[i];
            let option = document.createElement('option');
            option.value = device.id;
            option.text = device.label;
            document.getElementById('selectCamera').appendChild(option);
        }
        const cameraId = $.cookie('camera');
        if (cameraId) {
            document.getElementById('selectCamera').value = cameraId;
        }
    }
}).catch(err => {
    console.log(err);
});

function startCamera() {
    const config = {fps: 10, qrbox: {width: 250, height: 250}};
    if (cameraId) {
        html5QrCode.start(cameraId, config, qrCodeSuccessCallback);
    } else {
        html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccessCallback);
    }
}

startCamera();

function qrCodeSuccessCallback(qrCodeMessage) {
    const data = {
        qrCodeMessage: qrCodeMessage, requestId: document.getElementById('requestId').value
    };
    $.ajax({
        type: "POST", url: "/qrcode/validate",
        data: data,
        success: function (response) {
            console.log(response)
            if (response.success) {
                $('modalContent').html('<div class="alert alert-success" role="alert">QRCode validado com sucesso</div>');
                html5QrCode.stop();
                html5QrCode.clear();
            }
        }
    });
}

function changeCamera() {
    cameraId = document.getElementById('selectCamera').value;
    $.cookie('camera', cameraId, {path: '/'});
    html5QrCode.stop();
    html5QrCode.clear();
    startCamera();
}

function cancel() {
    html5QrCode.clear();
    html5QrCode.stop();
    self.close();
}