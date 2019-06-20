const express = require('express');
const app = express();
const User = require('../models/userModel');
const { verifyToken, verifyAdmin_Token }  = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// =======================================
//  Devolver todos los usuarios, paginados
// =======================================
app.get('/User', verifyToken, (req, res) => {

  let from = Number(req.query.from || 0);
  let elementsByPage = Number(req.query.to || 5);
  let filters = {state: true}; // For example "{google: true}"
  let fieldsToShow = 'name email img role state google';

  User.find(filters, fieldsToShow)
    .skip(from)
    .limit(elementsByPage)
    .exec( (err, usersDB) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if(!usersDB) return res.status(400).json({
        ok: false,
        err: {
          message: "No se encontraron usuarios en la BD"
        }
      });

      User.countDocuments({}, (err, userCount) => {
        res.status(200).json({
          ok: true,
          userCount,
          usersDB
        });
      });
    });
  });

// ====================================
//   Devolver un usuario, dado un ID
// ====================================
app.get('/User/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  User.findOne({_id:id}, (err, user) => {

    if(err) return res.status(400).json({
      ok: false,
      err
    });

    if (!user || !user.state) return res.status(400).json({
      ok: false,
      err: `El usuario con el ID: ${id} no existe en la base de datos`
    });

    res.status(200).json({
      ok: true,
      user
    });

  });
});

// ====================================
//      Agregar un usuario a la BD
// ====================================
app.post('/User', [verifyToken, verifyAdmin_Token], (req, res) => {
  let body = req.body;
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
    state:body.state,
    google: body.google
  });

  user.save( (err, userDB) =>  {
    if (err) return res.status(400).json({
        ok: false,
        err
      });
    res.status(200).json({
      ok: true,
      user: _.pick(userDB, '_id', 'name', 'email', 'img', 'role', 'state', 'google')
    });
  });

});
// =======================================
// Actualizar la información de un Usuario
// =======================================
app.put('/User/:id', [verifyToken, verifyAdmin_Token],  (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

  User.findOneAndUpdate({_id: id}, body, {new: true, runValidators: true}, (err, userDB) => {
    if(err) return res.status(400).json({
      ok: false,
      err
    });

    res.status(200).json({
      ok: true,
      user: _.pick(userDB, ['name', 'email', 'img', 'role', 'state', 'google'])
    });


  });

});

// ====================================
//    Eliminado lógico de un usuario
// ====================================

app.delete('/User/:id', [verifyToken, verifyAdmin_Token], (req, res) => {
  let id = req.params.id;
  let state = {state: false};

    User.findOneAndUpdate({_id: id}, state, (err, userDeleted) => {
      if (err) return res.status(400).json({
        ok: false,
        err
      });

      if (!userDeleted.state) return res.status(400).json({
        ok: false,
        error: {
          message: `El usuario con el id  no existe en la base de datos`
        }
      });

      res.status(200).json({
        ok: true,
        user: _.pick(userDeleted, '_id', 'name', 'email', 'img', 'role', 'state', 'google')

      });
    });
  });


module.exports = (
    app
);