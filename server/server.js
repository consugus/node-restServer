require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');
const url = require("./config/config");
const path = require ('path');

const app = express();

//This lines were copied directly from the documentation at www.npmjs.com/package/body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Configuración global de rutas
app.use (  require('./routes/index')   );

//habilitar la carpeta public
app.use ( express.static( path.resolve(__dirname , "..//public") ));


mongoose.connect( url, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
  if (err) throw new Error("no se pudo conectar a la base de datos", err);
  console.log('Base de datos ONLINE'.green);
});


app.listen(process.env.PORT, () => {
    console.log("\nEscuchando peticiones en el puerto 3000");
});