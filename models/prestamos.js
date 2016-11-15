const mongoose = require('mongoose');
const Schema 	 = mongoose.Schema;
const prestamos_schema = new Schema({
	monto: {
		type:Number,
		required:"El Monto es obligatorio"
	},
	plazo:{
		type:Number,
		required: "EL plazo es oblogatorio"
	},
	tipo_plazo:{
		type:String,
		required:'El tipo de plazo es obligatorio'
	},
	intereses:{
		type:Number,
		required:'Los intereses son requerido'
	},
	active:{
		type:Boolean,
		default:true
	},
	pagado:{
		type:Number,
		default:0
	},
	user:{type: Schema.Types.ObjectId, ref: "User"},
	cliente:{type: Schema.Types.ObjectId, ref: "Cliente"},
	
	
	date_register: { type: Date, default: Date.now }
});

var Prestamos = mongoose.model('Prestamos',prestamos_schema);
module.exports= Prestamos;