const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/User', (req, res) => {
    res.json({
      tipoPeticion: 'getUser LOCAL'
    });
  });

app.get('/User/:id', (req, res) => {
  let id = req.params.id;
  res.json({
    tipoPeticion: 'getUser',
    id
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

  app.delete('/User', (req, res) => {
    res.json({
      tipoPeticion: 'deleteUser'
    })
  });


module.exports = (
    app
);