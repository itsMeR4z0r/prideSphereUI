var express = require('express');
const Utils = require("../utils");
var router = express.Router();

/* GET users listing. */
router.get('/',function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('dashboard', { title: 'Express', user: req.user});
});

router.post('/',function(req, res, next) {
    if(req.isAuthenticated) {
        res.render('dashboard', { title: 'Express' });
    } else {
        res.redirect('/');
    }
});

router.get('/tipoRelatos', (req,res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('dashboard/gen_tipo_relatos');
});

module.exports = router;