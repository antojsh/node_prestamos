var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('../views/prestamos/index');
});

router.get('/new', function(req, res, next) {
    res.render('../views/prestamos/new');
});

module.exports = router;
