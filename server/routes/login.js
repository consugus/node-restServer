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

  }
//   verify().catch(console.error);


app.post('/google', (req, res) => {
    let token = req.body.idtoken;

    verify(token);

    

    res.status(200).json({
        token
    }
    );
});









module.exports = (
    app
);