const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DBCONNECTIONSTRING

mongoose.connect(URL).then(() => {
    console.log("MongoDB Atlas connected successfully")
}).catch((error) => {
    console.log("MongoDB Atlas connection error:- ", error);
})