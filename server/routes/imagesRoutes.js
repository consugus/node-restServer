const express = require("express");
const fs = require ("fs");
const path = require("path");
const {imgTokenVerification} = require('../middlewares/auth');

let app = express();

app.get( '/images/:type/:img',imgTokenVerification , ( req, res ) => {
    let type = req.params.type;
    let img = req.params.img;
    let allowedTypes = ["products", "user"];
    if(allowedTypes.indexOf(type) === -1){
        return res.status(400). json({
            ok: false,
            err: { message: `El tipo ingresado (${type}) no es válido. Debe ser uno de los siguientes: ${allowedTypes.join(", ")}` }
        });
    }

    let imagePath = path.resolve(__dirname, `../../uploads/${type+="Img"}/${img}`);

    if(fs.existsSync(imagePath) ){
        res.status(200).sendFile(imagePath);
    } else {
        let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");
        res.status(200).sendFile(noImagePath);
    };

});








module.exports = app;