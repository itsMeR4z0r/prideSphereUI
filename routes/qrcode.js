var express = require('express');
const http = require("http");
var router = express.Router();
let utils = require('../utils');
const passport = require("passport");

/* GET users listing. */
router.get('/', function (req, res, next) {
    var id = new utils().decrypt(req.query.id);
    res.render('qrCodeReader', {title: 'Express', qrCodetitle: 'Validacao Login', requestId: id});
});

router.get('/check', function (req, res, next) {
    var id = new utils().decrypt(req.query.id);
    res.render('qrCodeReader', {title: 'Express', qrCodetitle: 'Validacao Login', requestId: id});
});

router.post('/check', function (req, res, next) {
    if (!req.body.sid) {
        return res.json({error: 'requisicao invalida'});
    } else {
        let data = {
            userAgent: req.headers['user-agent'], sid: req.body.sid, date: new Date(), key: process.env.KEY_VALIDATION,
        }
        let util = new utils();
        let encrypted = util.encrypt(JSON.stringify(data));

        const options = {
            "method": "POST", "hostname": process.env.API_HOST, "port": process.env.API_PORT, "path": "/login/check"
        };
        const req2 = http.request(options, function (res2) {
            const chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                try {
                    const body = Buffer.concat(chunks);
                    const decrypted = util.decrypt(body.toString());
                    const data = JSON.parse(decrypted);
                    if (data.error) {
                        return res.json({error: data.error});
                    } else {
                        if (data.key === process.env.KEY_VALIDATION) {
                            passport.authenticate('QrCode', {}, (err, user, info) => {
                                if (err) {
                                    return res.status(500).json({error: err.message});
                                }
                                if (!user) {
                                    return res.status(401).json({error: info.message});
                                }
                                req.logIn(user, (err) => {
                                    if (err) { return next(err); }
                                    res.json({ success: true, message: 'Login successful' });
                                });
                            })(req, res, next);
                        } else {
                            return res.json({error: "chave invalida"});
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            });

        });
        req2.write(JSON.stringify({data: encrypted}));
        req2.end();
    }
});
router.post("/profile", passport.authenticate("cookie", {session: false}), function (req, res) {
    res.json(req.user);
});

router.post('/validate', function (req, res, next) {
    if (!req.body.qrCodeMessage) {
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
