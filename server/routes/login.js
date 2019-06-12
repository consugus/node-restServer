const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const User = require('../models/user');
const app = express();
const _ = require('underscore');

// for Google authentication
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne( ( {email: body.email} ), (err, usuarioDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        if (!usuarioDB) return res.status(400).json({
            ok: false,
            err: {
                message: "El (usuario) y/o la contraseña son incorrectos"
            }
        });

        if ( !bcrypt.compareSync(body.password, usuarioDB.password) ) return res.status(400).json({
            ok: false,
            err: {
                message: "El usuario y/o la (contraseña) son incorrectos"
            }
        });

        let payload = { usuario: _.pick(usuarioDB, '_id', 'name', 'email', 'img', 'role', 'state', 'google') };
        let secret = process.env.SECRET_TOKEN;
        let expiration = { expiresIn: process.env.EXPIRATION_TOKEN };

        let token = jwt.sign( payload, secret, expiration );

        res.json({
            ok: true,
            usuarioDB,
            token
        });
    });

});

// Google Configs
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.envCLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };

  }


app.post('/google', async (req, res) => {
    //cuando recibo el login por google, se recibe un token dentro del body del request
    let token = req.body.idtoken; //idtoken es la forma en que se llamó el token que se envía en el post desde google-signing.js

    // Primero verificamos con la función de Google verify() si es un usuario de google válido
    // En caso de que no lo sea, devolvemos el error
    let googleUser = await verify(token)
        .catch ( err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });


    // Si el usuario es válido, primero verificamos si existe en la BD
    User.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if(err){
            // Si hay un error al verificar la BD, devuelvo el error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si no hay error, es un usuario de Google válido, tenemos que verificar si
        // ese usuario de Google existe en nuestra BD
        if(usuarioDB){
            // Si existe en nuestra BD, vemos si anteriormente se autenticó mediante
            // el uso de credenciales de google o acreditación normal
            if(usuarioDB.google === false){
                // Si el usuario está almacenado en la BD pero no mediante google, sino
                // mediante credentiales corrientes
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debes utilizar tu autenticación normal (no google)"
                    }
                });
            } else {
                // El usuario tiene google=true, es decir utiliza google para autenticarse.
                // En éste caso debo actualizar su token para que dure el tiempo seteado
                let payload = { usuario: usuarioDB };
                let secret = process.env.SECRET_TOKEN;
                let expiration = { expiresIn: process.env.EXPIRATION_TOKEN };

                let token = jwt.sign( payload, secret, expiration );

                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token
                });
            }
        } else {
            // El usuario mostró credenciales válidas pero no existe en nuestra BD
            // En tal caso debemos guardar sus credenciales con un google = true
            let usuario = new User();

            usuario.name = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img || "acá va un string de imagen";
            usuario.google = true;
            usuario.password = ":)";

            console.log(usuario)

            usuario.save ( (err, usuarioDB) => {
                console.log("err: " + err)
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let payload = { usuario: usuarioDB };
                let secret = process.env.SECRET_TOKEN;
                let expiration = { expiresIn: process.env.EXPIRATION_TOKEN };

                let token = jwt.sign( payload, secret, expiration );

                res.status(200).json({
                    ok: true,
                    usuario: _.pick(usuarioDB, '_id', 'name', 'email', 'img', 'role', 'state', 'google'),
                    token
                });

            });
        }
    })
});









module.exports = (
    app
);




