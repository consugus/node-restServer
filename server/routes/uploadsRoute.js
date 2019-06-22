const express = require('express');
const fileUpload = require ('express-fileupload');  // Facilita la subida de archivos al servidor
const app = express();
const colors = require('colors');
const User = require("../models/userModel");
const Product = require('../models/productModel');
const fs = require('fs');                           // Para poder acceder al sistema de archivos
const path = require ('path');                      // para poder localizar carpetas dentro del path
const _ = require('underscore');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;                     // El Parámetro type especifica si el archivo que se sube es para 'products' o 'user'
    let id = req.params.id;
    let sampleFile = req.files.file;                // file es el nombre con el que debe llamarse el campo en Postman
    if (Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se subió ningún archivo'
            }
        });
    }

    // ====================================
    //             Validar tipos
    // ====================================
    let allowedTypes = ["products", "user"];
    if(allowedTypes.indexOf(type) === -1) return res.status(400).json({
        ok: false,
        message: `Los tipos permitidos son: ` + allowedTypes.join(", ") + `. El tipo ingresado "${type}" no es válido.`
    });


    // ====================================
    //    Validar extensiones permitidas
    // ====================================

    let allowedExtentions = ["jpg", "bmp", "gif", "jpeg"];
    let tmp = sampleFile.name.split(".");

    let extention = tmp.splice([tmp.length-1])[0];  // El elemento eliminado del array con splice se asigna a 'extention' pero como un array
    let fileName = tmp.join(".");                   // Lo que queda en el array 'tmp' se une con puntos y se asigna a 'fileName'

    if( allowedExtentions.indexOf(extention) === -1 ) return res.status(400).json({
        ok: false,
        message: `Las extensiones permitidas son: ` + (allowedExtentions.join(", ")).toUpperCase() + `. ${(extention)} no es una extensión válida`
    });


    // ==================================================
    // Pasadas las validaciones, construimos la respuesta
    // ==================================================

    // primero construimos el nombre con el que se va a almacenar el archivo en el servidor
    let fullFileName = fileName + "_" + generateSufix() + "." + extention;
    //Luego construimos la ruta de la carpeta donde se almacenan
    let path = `./uploads/${type + "Img/"}`;

    sampleFile.mv(`${path}` + `${fullFileName}`, (err) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        // Todo estuvo bien, llamamos a la función para que asocie la imagen en el servidor con el usuario
        if(type === "user"){
            UserImg(id, res, fullFileName);
        } else {
            ProductImg(id, res, fullFileName);
        };

    });
});


function UserImg(id, res, fullFileName){
    // Primero verifica que exista el usuario (la imagen ya está guardada)
    User.findById ( id, ( err, userDB ) =>{
        if(err) {
            // Como no pudo verificar si existe el usuario o no, pero la imagen estaba guardada en el servidor, por las dudas la eliminamos
            borrarImagenExistente(fullFileName, (type=+"Img") );
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if(!userDB) {
            // Pudo verificar que el usuario no existe. Como la imagen estaba guardada, debe eliminarse
            borrarImagenExistente(fullFileName, (type=+"Img") );
            return res.status(400).json({
                ok: false,
                err: { message: `El usuario con el id: ${id}  no existe` }
            })
        };

        // Verificamos que no exista previamente una imagen. De existir, eliminamos la anterior que está en 'userDb.img'
        let pathImage = path.resolve(__dirname, `../../uploads/userImg/${ userDB.img }`);
        if( fs.existsSync(pathImage) ){
            fs.unlinkSync(pathImage);
        };

        borrarImagenExistente(userDB.img, (type=+"Img") );

        // Asignamos la nueva imagen que estamos recibiendo
        userDB.img = fullFileName;
        // y guardamos en la base de datos
        userDB.save( ( err, savedUser ) => {
            console.log("savedUser: " + savedUser);
            res.status(200).json({
                ok: true,
                user: _.pick(savedUser, ["id", "name", "role", "img", "email"])
            });
        });
    });
};


function ProductImg(id, res, fullFileName){
    // Primero verifica que exista el producto (la imagen ya está guardada)
    Product.findById ( id, ( err, productDB ) =>{
        if(err) {
            // No se pudo comunicar con el servidor para ver si la imagen existe, por las dudas la eliminamos
            borrarImagenExistente(fullFileName, (type=+"Img") );
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if(!productDB) {
            // Si no puede verificar que el producto no existe. Como la imagen estaba guardada, debe eliminarse
            borrarImagenExistente(fullFileName, (type=+"Img") );
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El usuario con el id: ${id}  no existe`
                }
            })
        };

        // Verificamos que no exista previamente una imagen. De existir, eliminamos la anterior que está en 'productDB.img'
        let pathImage = path.resolve(__dirname, `../../uploads/productsImg/${ productDB.img }`);
        if( fs.existsSync(pathImage) ){
            fs.unlinkSync(pathImage);
        };

        borrarImagenExistente(productDB.img, (type=+"Img") );

        // Asignamos la nueva imagen que estamos recibiendo
        productDB.img = fullFileName;
        // y guardamos en la base de datos
        productDB.save( ( err, savedProduct ) => {
            if(err) return res.status(500).json({
                ok: false,
                err,
                product: productDB
            });

            if(!savedProduct) return res.status(400).json({
                ok: false,
                err: { message: `no se encontró el producto con id: ${id} en la BD`}
            });

            res.status(200).json({
                ok: true,
                savedProduct
            });
        });
    });
};


function borrarImagenExistente(imageName, type) {
    // Verificamos que no exista previamente una imagen. De existir, eliminamos la anterior que está en 'userDb.img'
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${ imageName }`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    };
};

let generateSufix = () => {
     // ====================================
    //        Generador del sufijo
    // ====================================
    let date = new Date();
    let year = "" + date.getFullYear();
    let month = "" +  ((date.getMonth() < 10 ) ? ("0" + date.getMonth()) : ("" + date.getMonth()) );
    let day = "" +  ((date.getDay() < 10 ) ? ("0" + date.getDay()) : ("" + date.getDay()) );
    let hour = "" +  ((date.getHours() < 10 ) ? ("0" + date.getHours()) : ("" + date.getHours()) ); // date.getHours();
    let min = "" +  ((date.getMinutes() < 10 ) ? ("0" + date.getMinutes()) : ("" + date.getMinutes()) );// "" + date.getMinutes();
    let sec = "" +  ((date.getSeconds() < 10 ) ? ("0" + date.getSeconds()) : ("" + date.getSeconds()) );// date.getSeconds();

    let sufix = "" + year + month + day + "-" + hour + min + sec;
    // console.log("year: " + year + "\nmonth: " + month + "\nday: " + day + "\nhour: " + hour + "\nmin: " + min + "\nsec: " + sec);

    return sufix
}


module.exports = app;