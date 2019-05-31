const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/User', (req, res) => {

  let from = Number(req.query.from || 0);
  let elementsByPage = Number(req.query.elementsByPage || 5);
  let filters = {state: true}; // For example "{google: true}"
  let fieldsToShow = 'name email ing role state google';

  User.find(filters, fieldsToShow)
    .skip(from)
    .limit(elementsByPage)
    .exec( (err, users) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      User.count({}, (err, userCount) => {
        res.status(200).json({
          ok: true,
          userCount,
          users
        });
      });
    });
  });

app.get('/User/:id', (req, res) => {
  let id = req.params.id;
  User.findOne({_id:id}, (err, user) => {

    if(err) return res.status(400).json({
      ok: false,
      err
    });

    if (!user.state) return res.status(400).json({
      ok: false,
      err: `El usuario con el ID: ${id} no existe en la base de datos`
    });

    res.status(200).json({
      ok: true,
      user
    });

  });
});

app.post('/User', (req, res) => {
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
      user: userDB
    });
  });

});

app.put('/User/:id', (req, res) => {
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

app.delete('/User/:id', (req, res) => {
  let id = req.params.id;
  let state = {state: false};


  // User.findByIdAndRemove( id, (err, userDeleted) => {
  //   if (err)
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });

  //   res.status(200).json({
  //     ok: true,
  //     userDeleted
  //   });
  // });

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
        userDeleted
      });
    });
  });


module.exports = (
    app
);