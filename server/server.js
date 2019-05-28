require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



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

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto 3000");
});