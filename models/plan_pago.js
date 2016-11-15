const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Plan_pago_schema = new Schema({
    dia: {
        type: String,
        required: "El tipo de plazo es obligatorio"
    },
    valor_a_pagar: {
        type: Number,
        required: "EL valor del plazo es obligatorio"
    },
    valor_pagado:{
    	type:Number,
    	default:0
    },
    status: {
        type: String,
        default: "Pendiente"
    },
    user_creation: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    user_cobro: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente"
    },
    prestamo: {
        type: Schema.Types.ObjectId,
        ref: "Prestamos"
    },
    observacion:{
    	type:String
    },


    date_register: { type: Date, default: Date.now }
});

var Plan_pago = mongoose.model('Plan_pago', Plan_pago_schema);
module.exports = Plan_pago;
