var express = require('express');
const http = require("http");
var router = express.Router();
let utils = require('../utils');
/* GET users listing. */
router.get('/', function (req, res, next) {
    var id = new utils().decrypt(req.query.id);
    res.render('qrCodeReader', {title: 'Express', qrCodetitle: 'Validacao Login', requestId: id});
});
router.get('/check', function (req, res, next) {
    var id = new utils().decrypt(req.query.id);
    res.render('qrCodeReader', {title: 'Express', qrCodetitle: 'Validacao Login', requestId: id});
});
router.post('/validate', function (req, res, next) {
    if (!req.body.qrcode) {
        res.json({error: 'QRCode invalido'});
        return;
    }
    try {
        let data = {
            qrCodeMessage: req.body.qrCodeMessage,
            date: new Date(),
            key: process.env.KEY_VALIDATION,
            requestId: req.body.requestId
        }
        let util = new utils();
        let encrypted = util.encrypt(JSON.stringify(data));

        const options = {
            "method": "POST", "hostname": process.env.API_HOST, "port": process.env.API_PORT, "path": "/login/validate"
        };

        const req2 = http.request(options, function (res2) {
            const chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                const body = Buffer.concat(chunks);
                const decrypted = util.decrypt(body.toString());
                const data = JSON.parse(decrypted);
                if (data.error) {
                    res.json({error: data.error});
                } else {
                    if (data.key === process.env.KEY_VALIDATION) {
                        let dataReturn = {
                            sid: data.sid, qrcode: data.qrcode, success: 'success'
                        }
                        res.json(dataReturn);
                    } else {
                        res.json({error: 'Invalid Credentials'});
                    }
                }
            });
        });

        req2.write(JSON.stringify({data: encrypted}));
        req2.end();
    } catch (e) {
        res.json({error: 'QRCode invalido'});
    }
})

module.exports = router;
