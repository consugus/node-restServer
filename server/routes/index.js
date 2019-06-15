const express = require('express');
const app = express();

app.use (  require('./userRoutes')     );
app.use (  require('./loginRoutes')    );
app.use ( require ('./categoryRoutes') );

// console.log("llama a las rutas desde el index");


module.exports = (
    app
);