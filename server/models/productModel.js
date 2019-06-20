var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    unitPrice: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// productSchema.plugin(uniqueValidator, {message: "Error, ya existe en la base de datos el producto '{VALUE}'"});

module.exports = mongoose.model('Product', productSchema);