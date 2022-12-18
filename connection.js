require("dotenv").config();
const mongoose = require("mongoose");
module.exports.connectToDB = connectToDB;
// Connect to Database
function connectToDB (){

const LOCAL_URL_STRING = "Mongodb://127.0.0.1:27017";


mongoose.set("strictQuery", true);

mongoose.connect( process.env.ONLINE_URL_STRING + "/todolistDB")
    .then((result) => console.log("Connected to DB Successfully"))
    .catch((err) => console.log("There's an error connecting" + err));


}