const express = require('express');
const fileUpload = require ('express-fileupload');
const app = express();
const colors = require('colors');
const User = require("../models/userModel");

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;
    let sampleFile = req.files.file; //file es el nombre con el que debe llamarse el campo en Postman
    if (Object.keys(req.files).length == 0) {
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

    let extention = tmp.splice([tmp.length-1])[0]; // El elemento eliminado del array con splice se asigna a 'extention'
    let fileName = tmp.join(".");          // Lo que queda en el array 'tmp' se une con puntos y se asigna a 'fileName'

    if( allowedExtentions.indexOf(extention) == -1 ) return res.status(400).json({
        ok: false,
        message: `Las extensiones permitidas son: ` + (allowedExtentions.join(", ")).toUpperCase() + `. ${(extention)} no es una extensión válida`
    });

    let fullFileName = fileName + "_" + generateSufix() + "." + extention;
    let path = `./uploads/${type + "Img/"}`;

    sampleFile.mv(`${path}` + `${fullFileName}`, (err) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        res.status(200).json({
            ok: true,
            message: `El archivo se subió exitosamente con el nombre ${fullFileName}`
        });

    });

});

let generateSufix = () => {
     // ====================================
    //        Generador del sufijo
    // ====================================
    let date = new Date();
    let year = "" + date.getFullYear();
    let month = "" +  ((date.getMonth() < 10 ) ? ("0" + date.getMonth()) : ("" + date.getMonth()) );
    let day = "" +  ((date.getDay() < 10 ) ? ("0" + date.getDay()) : ("" + date.getDay()) );
    let hour =  date.getHours();
    let min =  "" + date.getMinutes();
    let sec =  date.getSeconds();
    // let sufix = "" + year + month + day + "_" + hour + ":" + min + ":" + sec;
    let sufix = "" + year + month + day + "-" + hour + min + sec;
    // console.log("year: " + year + "\nmonth: " + month + "\nday: " + day + "\nhour: " + hour + "\nmin: " + min + "\nsec: " + sec);
    // console.log(sufix);
    return sufix
}


module.exports = app;