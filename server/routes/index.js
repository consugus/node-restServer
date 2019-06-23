const express = require('express');
const app = express();

app.use ( require ('./userRoutes')      );
app.use ( require ('./loginRoutes')     );
app.use ( require ('./categoryRoutes')  );
app.use ( require ('./productRoute')    );
app.use ( require ('./uploadsRoute')    );
app.use ( require ('./imagesRoutes')    );


module.exports = (
    app
);