var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    setTimeout(function() {
        res.send('respond with a resource');
    }, 3000);
});


module.exports = router;