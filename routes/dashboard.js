var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('Entro a esto')
  res.render('../views/dashboard/cobrador');
});

module.exports = router;
