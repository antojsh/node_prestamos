const mongoose = require('mongoose');
const Schema 	 = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const users_schema = new Schema({
	name: {
		type:String,
		required:"El Nombre es obligatorio"
	},
	user:{
		type:String,required:"El usuario es obligatorio",
		minlength:[3,"Usuario muy corto"],
		unique: true
	},
	email:{
			type:String,required:"El correo es obligatorio",
			unique: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Coloca un email valido']
    
	},
	password:{
			type:String,
			required:"Se requiere una contraseña",
			minlength:[6,"Contraseña muy corta"],
			validate:{
				validator:function(p){
					return this.password_confirmation==p
				}
				,
				message:"Las contraseñas no son iguales"
			}
	},
	token:{
		type:String
	},
	provider_id	: String,
	provider	: String,
	photo		: String,
	date_birthday: { type: Date, default: Date.now },
	date_register: { type: Date, default: Date.now }
});
users_schema.plugin(uniqueValidator, { message: 'Este {PATH} ya se encuentra en uso' });
users_schema.virtual('password_confirmation').get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c=password;
})
var User = mongoose.model('User',users_schema);
module.exports= User;