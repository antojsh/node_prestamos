'use strict'
var express = require('express');
var router = express.Router();
var Tipo_plazo = require('../models/tipo_plazos')
var Cliente = require('../models/cliente');
var Prestamos = require('../models/prestamos');
var Plan_pago = require('../models/plan_pago')
var moment = require('moment')
    /* GET home page. */



router.get('/new', function(req, res, next) {
    Tipo_plazo.find({}, function(err, plazos) {
        console.log(plazos)
        res.render('../views/clientes/new', { plazos: plazos });
    })

});
router.route('/:id')
    .get(function(req, res) {
        Prestamos.findOne({ cliente: req.params.id, active: true }, function(err, prestamo) {
            console.log(prestamo)
            Plan_pago.find({ cliente: req.params.id, prestamo: prestamo })
                .populate('cliente')
                .populate('prestamo')
                .exec(function(err, plan) {
                    console.log(plan,' MIERDA')
                    res.render('../views/clientes/show', { planes: plan, grafica:JSON.stringify(plan) });
                })
        })


    })
router.route('/')
    .post(function(req, res) {
        let cliente = new Cliente({
            name: req.body.name,
            tipo_id: req.body.tipo_id,
            identificacion: req.body.identificacion,
            direccion: req.body.direccion,
            celular: req.body.celular,
            email: req.body.email,
            descripcion: req.body.descripcion,
            user: req.session.user_id
        })
        cliente.save(function(err, newclient) {
            if (err) {
                console.log('ERROR ' + err)
                return res.send('Error en cliente ' + err)
            }

            guardarPrestamo(req, res, newclient)
        })
    })
    .get(function(req, res, next) {
        Cliente.find({ user: req.session.user_id }, function(err, clientes) {
            console.log(clientes)
            res.render('../views/clientes/index', { clientes: clientes });
        })


    })

function guardarPrestamo(req, res, client) {
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
            intereses = crearPlanDePago(plazo_cliente, interes_diario, deuda_diaria, req.session.user_id, client, false, null)

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
            cliente: client._id
        })

        prestamo.save(function(err, prestamo_new) {
            if (err) {
                return res.send('Error ' + err)
            }
            crearPlanDePago(plazo_cliente, interes_diario, deuda_diaria, req.session.user_id, client, true, prestamo_new._id)
            return res.send('Guardado')

        })
    })

}

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
                    console.log('Plan Guardado')
                }
            })
        }

    }
    return intereses;
}

module.exports = router;
