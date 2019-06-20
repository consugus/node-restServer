require('./config/config');

const express = require('express');         // Provides small, robust tooling for HTTP servers
const bodyParser = require('body-parser');  // Parse incoming request bodies in a middleware before your handlers, available under the req.body property
const mongoose = require('mongoose');       // Is a MongoDB object modeling tool designed to work in an asynchronous environment
const colors = require('colors');           // Provides a way to show messages on CLI customized with colors, underlying, etc
const url = require("./config/config");     // Calls proyect config.js, a file with globals
const path = require ('path');              // Self NodeJS module to handle Windows enviroment path

const app = express();

// ====================================
//            Body-Parser
// ====================================
//This lines were copied directly from the documentation at www.npmjs.com/package/body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// ====================================
//               Routes
// ====================================
// Configuración global de rutas
app.use ( require('./routes/index') );


// ====================================
//           Public Folder
// ====================================
//habilitar la carpeta public
// app.use ( express.static( path.resolve(__dirname , "../public") ));
app.use(express.static(path.resolve(__dirname, '../public')));


// ====================================
//         Mongoose Connection
// ====================================
mongoose.connect( url, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
  if (err) throw new Error("no se pudo conectar a la base de datos", err);
  console.log('Base de datos ONLINE'.green);
});

app.listen(process.env.PORT, () => {
    console.log("\nEscuchando peticiones en el puerto 3000");
});