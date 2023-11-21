var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let lat = 0;
    let lon = 0;
    if (req.query.lat && req.query.lon) {
        lat = req.query.lat;
        lon = req.query.lon;
    }
    res.render('index', {title: 'Express',lat: lat, lon: lon});
});

module.exports = router;
