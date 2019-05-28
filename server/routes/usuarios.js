const express = require('express');
const app = express();

app.get('/usuario', (req, res) => {
    res.json({
      tipoPeticion: 'getUsuario LOCAL'
    });
  });

  app.get('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
      tipoPeticion: 'getUsuario',
      id
    });
  });

  app.post('/usuario', (req, res) => {
    let body = req.body;
    res.json({
      tipoPeticion: 'postUsuario',
      persona: body
    });
  });

  app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
      tipoPeticion: 'putUsuario',
      id
    });
  });

  app.delete('/usuario', (req, res) => {
    res.json({
      tipoPeticion: 'deleteUsuario'
    })
  });


module.exports = (
    app
);