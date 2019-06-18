const express = require('express');
const app = express();

app.use (  require('./userRoutes')     );
app.use (  require('./loginRoutes')    );
app.use ( require ('./categoryRoutes') );


module.exports = (
    app
);