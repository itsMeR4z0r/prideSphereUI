var express = require('express');
const Utils = require("../utils");
const http = require("http");
var router = express.Router();
const util = new Utils();
/* GET users listing. */
router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('dashboard', {title: 'Express', user: req.user});
});

router.use('/tipoRelatos', require('./dashboard/tipoRelatos'));

module.exports = router;