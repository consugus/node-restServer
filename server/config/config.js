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
    urlDB = "mongodb+srv://consugus:mdbcon5u9u$@cluster0-lsyja.mongodb.net/cafe"
}

// let urlDB = "mongodb+srv://consugus:mdbcon5u9u$@cluster0-lsyja.mongodb.net/cafe"

module.exports = (
    urlDB
)