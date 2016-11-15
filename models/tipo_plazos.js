const mongoose = require('mongoose');
const Schema 	 = mongoose.Schema;
const plazos_schema = new Schema({
	tipo_plazo: {
		type:String,
		required:"El tipo de plazo es obligatorio"
	},
	valor_en_dias:{
		type:Number,
		required: "EL valor del plazo es obligatorio"
	},
	
	
	date_register: { type: Date, default: Date.now }
});

var Tipo_plazo = mongoose.model('Plazos',plazos_schema);
module.exports= Tipo_plazo;