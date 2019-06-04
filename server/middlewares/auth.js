const jwt = require('jsonwebtoken');

// ==================================
//        Token Verification
// ==================================

let verifyToken = (req, res, next) => {

    let token = req.get( 'token' );

    jwt.verify(token, process.env.SECRET_TOKEN, (err, payload) => {
        if (err) return res.status(401).json({
            ok: false,
            err: {
                message: "No es un usuario válido"
            }
        });

        req.usuario = payload.usuario;
        next();
    });
};


// ==================================
//     Token Verificación Admin
// ==================================

let verifyAdmin_Token = (req, res, next) => {

    // let token = req.get( 'token' );
    let usuario = req.usuario

    if(usuario.role !=="admin") return res.status(401).json({
        ok:false,
        err: {
            message: "No tiene los privilegios de administrador para realizar la tarea"
        }
    });
    next();
};


module.exports = {
    verifyToken,
    verifyAdmin_Token
}
