const express = require('express');
const router = express.Router();
const utils = require('../utils');
const http = require('http');
const { v4 } = require('uuid');

/* GET users listing. */
router.get('/', function (req, res, next) {
    if(req.isAuthenticated()) {
            return res.redirect('/dashboard');
    }
    return res.render('login', {
        title: 'Express',
        sessionId: v4(),
    });
});
router.get('/logout', function (req, res, next) {
    req.logout(err => {
        if (err) { return res.json({ success: false, message: 'Logout failed' }); }
        req.session.destroy(() => {
            res.redirect('/login')
        });
    });
});
router.post('/', function (req, res, next) {
    if (!req.body.email) {
        res.json({error: 'Invalid Credentials'});
        return;
    }
    let data = {
        email: req.body.email,
        date: new Date(),
        key: process.env.KEY_VALIDATION,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        requestId: req.body.requestId
    }
    let util = new utils();
    let encrypted = util.encrypt(JSON.stringify(data));


    const options = {
        "method": "POST", "hostname": process.env.API_HOST, "port": process.env.API_PORT, "path": "/login"
    };

    const req2 = http.request(options, function (res2) {
        const chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body)
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

});


module.exports = router;