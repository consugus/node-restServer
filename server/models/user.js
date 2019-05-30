const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['user', 'admin'],
    message: 'Error, {VALUE} no es un rol válido'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false,
        default: "me cago en la puta que lo parió"
    },
    role: {
        type: String,
        required: [true, 'El rol es requerido'],
        default: 'user',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        required: false
    },
});
userSchema.plugin(uniqueValidator, {message: "Error, ya existe en la base de datos el email '{VALUE}'"});

module.exports = mongoose.model('User', userSchema);