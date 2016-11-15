const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const cliente_schema = new Schema({
    name: {
        type: String,
        required: "El Nombre es obligatorio"
    },
    tipo_id: {
        type: String,
        require: "El tipo de identificacion es obligatorio"
    },
    identificacion: {
        type: Number,
        require: "La identificacion es obligatoria"
    },
    direccion: {
        type: String,
        require: "La direccion es obligatoria"
    },
    celular:{
        type:Number,
        require:'Celular es obligatorio'
    },
    email:{
            type:String,required:"El correo es obligatorio",
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Coloca un email valido']
    
    },
    descripcion:{
        type:String
    },
    user:{type: Schema.Types.ObjectId, ref: "User"},
    loc: {
        type: [],
        index: '2d'
    },
    date_register: { type: Date, default: Date.now }
});
cliente_schema.plugin(uniqueValidator, { message: 'Este {PATH} ya se encuentra en uso' });
cliente_schema.virtual('password_confirmation').get(function() {
    return this.p_c;
}).set(function(password) {
    this.p_c = password;
})
var Cliente = mongoose.model('Cliente', cliente_schema);
module.exports = Cliente;
