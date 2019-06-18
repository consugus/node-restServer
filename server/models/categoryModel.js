const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// Crear el modelo para las categorías
let categorySchema = new Schema({
    name: {
        type: String,
        unique: false,
        required: [true, 'El nombre de la categoría es requerido']
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'userModel'
    },
    state: {
        type: Boolean,
        default: true
    }
});



categorySchema.plugin(uniqueValidator, {message: "Error, ya existe en la base de datos la cagetoría '{VALUE}'"});

module.exports = mongoose.model('Category', categorySchema);