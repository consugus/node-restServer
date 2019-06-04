const jwt = require('jsonwebtoken');

// ==================================
//        Token Verification
// ==================================

let verifyToken = (req, res, next) => {

    let token = req.get( 'token' );

    jwt.verify(token, process.env.SECRET_TOKEN, (err, payload) => {
        if (err) return res.status(401).json({
            ok: false,
            err
        });

        req.usuario = payload.usuario;
        next();

    });


};


module.exports = {
    verifyToken
}
