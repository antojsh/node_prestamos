var express = require('express');
var router = express.Router();
var Plan_pago = require('../models/plan_pago')
var Prestamos = require('../models/prestamos')
    /* GET home page. */
router.route('/:id')
    .get(function(req, res) {
        Plan_pago.findById(req.params.id)
            .populate('cliente')
            .exec(function(err, plan) {
                if (err) {
                    res.render('error')
                } else {
                    if (plan) {
                        res.render('../views/pagos/show', { plan: plan })
                    } else {
                        res.render('error')
                    }
                }
            })
    })
    .put(function(req, res) {
        Plan_pago.findById(req.params.id)
            .populate('prestamo')
            .exec(function(err, plan) {
                plan.valor_pagado = parseInt(plan.valor_pagado) + parseInt(req.body.valor_pagado)
                plan.observacion = req.body.observacion
                if (plan.valor_pagado == 0) {
                    plan.status = 'Atrasado'
                } else if (plan.valor_a_pagar > plan.valor_pagado) {
                    plan.status = 'Incompleto'
                } else if (plan.valor_a_pagar == plan.valor_pagado) {
                    plan.status = 'Pagado'
                } else if (plan.valor_a_pagar < plan.valor_pagado) {
                    plan.status = 'Pagado'
                }
                plan.save(function(err) {
                    if (err) {
                        res.send('Error ' + err)
                    } else {
                        Prestamos.findById(plan.prestamo._id, function(err_pres, prestamo) {
                            if (err_pres) {
                                res.send('Error ' + err_pres)
                            } else {
                                prestamo.pagado = prestamo.pagado + plan.valor_pagado
                                prestamo.save(function(err_save) {
                                    if (err_save) {
                                        res.send('Error ' + err_save)
                                    } else {
                                        res.send(plan)
                                    }
                                })
                            }

                        })

                    }
                })
            })
    })


module.exports = router;
