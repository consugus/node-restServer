const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const User = require('../models/user');
const app = express();
const _ = require('underscore');


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









module.exports = (
    app
);