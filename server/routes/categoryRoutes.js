const express = require('express');
const app = express();
const Category = require('../models/categoryModel');
const { verifyToken, verifyAdmin_Token }  = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// ====================================
//    Devolver todas las categorías
// ====================================
app.get( "/category", [verifyToken], (req, res) => {
    let state = {state: true};

    Category.find( state, (err, categoriesDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriesDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se encontraron categorías almacenadas"
                }
            });
        };



        res.status(200).json({
            ok: true,
            categoriesDB
        });
    });
});


// ====================================
//    Devolver categoría dado un ID
// ====================================
app.get( "/category/:id", [verifyToken], (req, res) => {
    //Debe retornar el ID de la categoría
    let id = req.params.id;
    let state = {state: true};

    Category.findById( id,  (err, categoryDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoryDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: `La categoría con el ID: ${id} no existe en la base de datos`
                }
            });
        };

        res.status(200).json({
            ok: true,
            categoryDB
        });
    });
});

// ====================================
//          Crear categoría
// ====================================
app.post( "/category", [verifyToken], (req, res) => {
    let body = req.body;
    let category = new Category({
        name: body.name,
        user: req.usuario._id
    });


    // console.log(req);

    category.save( (err, categoryDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo crear la categoría"
                }
            });
        }

        res.status(200).json({
            ok: true,
            category: categoryDB
        });

    });


});


// ====================================
//   Actualizar categoría dado un ID
// ====================================
app.put( "/category/:id", [verifyToken], (req, res) => {
    // Debe permitir actualizar el nombre de la categoría
    let id = req.params.id;
    let body = req.body;

    Category.findOneAndUpdate( {_id: id}, body, {new: true, runValidators: true}, (err, categoryDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!categoryDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar la categoría'
                }
            });
        };

        res.status(200).json({
            ok: true,
            category: categoryDB
        });

    });
});


// ====================================
//   Eliminar categoría dado un ID
// ====================================
app.delete( "/category/:id", [verifyToken, verifyAdmin_Token], (req, res) => {
    // Implementar un borrado lógico
    let id = req.params.id;
    let state = {state: false};

    console.log("hasta acá se ejecutó ok");

    Category.findOneAndUpdate( {_id: id}, state, {new: true, runValidators: true}, (err, userDeleted) => {
        if ( err ) return res.status(400).json({
            ok: false,
            err
          });

        if( !userDeleted ) return res.status(500).json({
            ok: false,
            err: {
                message: `No se pudo borrar la categoría con el id ${id}`
            }
        });

        res.status(200).json({
            ok: true,
            userDeleted
        });

    });
});


module.exports = (
    app
);