require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');

const app = express();

// parse application/x-www-form-urlencoded
//This lines were copied directly from the documentation at www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use (  require('./routes/usuarios')   );

mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true }, (err, res) => {
  if (err) throw new Error("no se pudo conectar a la base de datos", err);
  console.log('Base de datos ONLINE'.green);
});


app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto 3000");
});