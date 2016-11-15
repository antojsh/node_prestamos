var express = require('express');
var router = express.Router();
var dashboard = require('./dashboard')
var prestamos = require('./prestamos')
var clientes = require('./clientes')
var pagos = require('./pagos')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/dashboard',dashboard)
router.use('/prestamos',prestamos)
router.use('/clientes',clientes)
router.use('/pagos',pagos)
module.exports = router;
