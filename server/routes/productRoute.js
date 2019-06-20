const express = require('express');
const app = express();
const { verifyToken }  = require('../middlewares/auth');
const _ = require('underscore');
const colors = require('colors');
const Products = require('../models/productModel');

// ====================================
//    Devolver todas los productos
// ====================================
app.get( '/products', [verifyToken], (req, res) => {

    // devolver todos los productos con available = true
    // populate: usuario y categoría
    // implementar paginación

    let from = Number(req.query.from || 0);                 // Where to start listing Products, default = 0
    let elementsByPage = Number(req.query.to || 5);         // How many Products are going to be listed, default = 0
    let filters = {available: true};                        // For example "{available: true}"
    let fieldsToShow = 'name unitPrice description user';   // Fields to show, obviously

    Products.find ( filters, fieldsToShow, ( err, productsDB ) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        if(!productsDB) return res.status(400).json({
            ok: false,
            err: {
                message: 'No se encontraron productos en la BD'
            }
        });

        Products.countDocuments( {}, ( err, productsCount ) => {
            if(err) return res.status(500).json({
                ok: false,
                err
            });

            if(!productsDB) return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo recuperar los productos de la BD"
                }
            });

            res.status(200).json({
            ok: true,
            productsCount,
            productsDB
            });
        })
    })
    .sort({name: 1})
    .skip(from)
    .limit(elementsByPage)
    .populate('category', 'name')
    .populate('user', 'name');
});

// ====================================
//    Devolver producto dado un ID
// ====================================

app.get( "/products/:id", [verifyToken], (req, res) => {
    // Debe retornar un producto dado un ID determinado
    // populate: usuario y categoría
    // implementar paginación

    let id = req.params.id;
    let filters = {available: true};
    let fieldsToShow = 'name unitPrice';

    Products.findById(id, ( err, productDB ) => {
        if(err) return res.status(500).json({
            ok: false,
            err
        });

        if( !productDB || !productDB.available) return res.status(400).json({
            ok: false,
            err: {
                message: `No se encontró el producto con el ID ${id} en la BD`
            }
        });



        res.status(200).json({
            ok: true,
            productDB
        });
    })
    .populate('category', 'name')
    .populate('user', 'name')

});

// ====================================
//          Crear producto
// ====================================
app.post( "/products", [verifyToken], (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado

    let body = req.body
    let product = new Products({
        name: body.name,
        unitPrice: Number(body.unitPrice),
        description: body.description,
        category: body.category,
        user: req.usuario._id
    });

    product.save( (err, productDB) => {
        if( err ) return res.status(500).json({
            ok: false,
            err
        });

        if(!productDB) return res.status(400).json({
            ok: false,
            err: {
                message: "No se pudo guardar en producto en la base de datos"
            }
        });

        res.status(200).json({
            ok: true,
            productDB
        });
    });

});


// ====================================
//   Actualizar producto dado un ID
// ====================================
app.put( "/products/:id", [verifyToken], (req, res) => {
    // Debe permitir actualizar el producto
    // grabar el usuario
    // grabar una categoría del listado

    let id = req.params.id;
    let body = req.body;

    Products.findOneAndUpdate( {_id: id}, body, {new: true, runValidators: true}, ( err, productDB ) => {
        if(err) return res.status(500).json({
            ok: false,
            err
        });

        if(!productDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar el producto'
                }
            });
        };

        res.status(200).json({
            ok: true,
            product: productDB
        });
    })
});


// ====================================
//   Eliminar producto dado un ID
// ====================================
app.delete( "/products/:id", [verifyToken], (req, res) => {
    // Implementar un borrado lógico, actualizando el campo 'available'
    let id = req.params.id;
    let body = {available: false};

    Products.findOneAndUpdate( {_id: id}, body, {new: true, runValidators: true}, ( err, productDeleted ) => {
        if(err) return res.status(500).json({
            ok: false,
            err
        });

        if(!productDeleted){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo eliminar el producto'
                }
            });
        };

        res.status(200).json({
            ok: true,
            product: productDeleted,
            message: `Se eliminó correctamente el producto con el ID ${id}`
        });
    })

})




module.exports = (
    app
)