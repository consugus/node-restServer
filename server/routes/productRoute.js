const express = require('express');
const app = express();
const { verifyToken }  = require('../middlewares/auth');
const _ = require('underscore');
const Product = require('../models/productModel');

// ====================================
//    Devolver todas los productos
// ====================================
// TODO:
app.get( '/products', [verifyToken], (req, res) => {
    // devolver todos los productos con state = true
    // populate: usuario y categoría
    // implementar paginación
});


// ====================================
//    Devolver producto dado un ID
// ====================================
// TODO:
app.get( "/products/:id", [verifyToken], (req, res) => {
    // Debe retornar un producto dado un ID determinado
    // populate: usuario y categoría
    // implementar paginación

});

// ====================================
//          Crear producto
// ====================================
// TODO:
app.post( "/products", [verifyToken], (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado
});


// ====================================
//   Actualizar producto dado un ID
// ====================================
// TODO:
app.put( "/products/:id", [verifyToken], (req, res) => {
    // Debe permitir actualizar el producto
    // grabar el usuario
    // grabar una categoría del listado

});


// ====================================
//   Eliminar producto dado un ID
// ====================================
// TODO:
app.delete( "/products/:id", [verifyToken], (req, res) => {
    // Implementar un borrado lógico, actualizando el campo 'available'

})







TODO: // Crear todas las llamadas desde Postman y guardarlas

module.exports = (
    app
)