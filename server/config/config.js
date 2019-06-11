//=======================================
//         Port Configuration
//=======================================

process.env.PORT = process.env.PORT || 3000;


//=======================================
//             Enviroment
//=======================================
// the "process.env.NODE_ENV" es a Heroku variable. If the project is running
// served from Heroku, it will have a value. If not, let's assign the "string"
// chain to the env variable
let env = process.env.NODE_ENV || "env";


//=======================================
//              DataBase
//=======================================

let urlDB;
if (env === "env") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URL;
}

//=======================================
//              Token
//=======================================

process.env.SECRET_TOKEN = process.env.SEED || "seed de desarrollo";
// process.env.SECRET_TOKEN = "seed de desarrollo";
process.env.EXPIRATION_TOKEN = 2592000; // 1 mes


//=======================================
//              Google ClientID
//=======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || "772753878625-fo5t3tdeu7krf9ga91ekh8aes9lhbpl4.apps.googleusercontent.com";



module.exports = (
    urlDB
)



