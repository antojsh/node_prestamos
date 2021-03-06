'use strict'
var express = require('express');
var router = express.Router();
var Tipo_plazo = require('../models/tipo_plazos')
var clientes = require('../models/cliente')
var Prestamos = require('../models/prestamos')
var Plan_pago = require('../models/plan_pago')
var moment = require('moment')
    /* GET home page. */
    // router.get('/', function(req, res, next) {
    //     res.render('../views/prestamos/index');

// });

router.get('/new', function(req, res, next) {
    Tipo_plazo.find({}, function(err, plazos) {
        clientes.find({}, function(err, clientes) {
            console.log(plazos)
            res.render('../views/prestamos/new', { plazos: plazos, clientes: clientes });
        })
    })

});



router.route('/')
    .get(function(req, res) {
        Prestamos.find({ user: req.session.user_id })
            .populate('cliente')
            .exec(function(err, prestamos) {
                res.render('../views/prestamos/index', { prestamos: prestamos })
            })
    })
    .post(function(req, res) {
        Prestamos.find({ cliente: req.body.cliente, active: true }, function(err, prestamo) {
            if (err) {
                res.send({ success: false, message: 'Error de conexion, intentelo nuevamente' })
                return
            }
            console.log(prestamo)
            if (prestamo.length >0) {
                res.send({ success: false, message: 'El cliente ya tiene un prestamo activo' })
                return
            } else {


                var intereses = 0
                var monto = req.body.monto
                var tipo = req.body.tipo_plazo
                var plazo_cliente = req.body.plazo
                let interes_diario = 0
                let deuda_diaria = 0
                Tipo_plazo.findById(tipo, function(err, plazo) {
                    if (plazo.tipo_plazo == 'Diario') {
                        interes_diario = (monto / 30) * 0.20
                        deuda_diaria = monto / plazo_cliente
                            // intereses = monto * 0.20
                        intereses = crearPlanDePago(plazo_cliente, interes_diario, deuda_diaria, req.session.user_id, req.body.cliente, false, null)

                    } else if (plazo.tipo_plazo == 'Semanal') {
                        intereses = (monto * (7 * plazo)) * 0.20
                    } else if (plazo.tipo_plazo == 'Quincenal') {
                        intereses = (monto * (15 * plazo)) * 0.20
                    } else if (plazo.tipo_plazo == 'Mensual') {
                        intereses = (monto * (30 * plazo)) * 0.20
                    }
                    var prestamo = new Prestamos({
                        monto: req.body.monto,
                        plazo: req.body.plazo,
                        tipo_plazo: req.body.tipo_plazo,
                        intereses: intereses,
                        user: req.session.user_id,
                        cliente: req.body.cliente
                    })

                    prestamo.save(function(err, prestamo_new) {
                        if (err) {
                            return res.send('Error ' + err)
                        }
                        crearPlanDePago(plazo_cliente, interes_diario, deuda_diaria, req.session.user_id, req.body.cliente, true, prestamo_new._id)
                        res.send({ success: true, message: 'Prestamo Guardado correctamente' })


                    })
                })
            }
        })

    })

function crearPlanDePago(plazo_cliente, interes_diario, deuda_diaria, user, client, bandera, prestamo) {
    let total = 0
    let intereses = 0
    var fecha = moment(new Date());
    for (var i = 0; i < plazo_cliente; i++) {
        total += deuda_diaria + interes_diario;
        intereses += interes_diario
        if (bandera) {
            let Plan = new Plan_pago({
                dia: moment(new Date()).add(i + 1, 'day'),
                valor_a_pagar: Math.round(deuda_diaria + interes_diario),
                user_creation: user,
                cliente: client,
                prestamo: prestamo
            })
            Plan.save(function(err) {
                if (err) {
                    console.log(err)
                } else {
                    //console.log('Plan Guardado')
                }
            })
        }

    }
    return intereses;
}


module.exports = router;
