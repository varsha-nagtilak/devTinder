//Pwd: 7exM1nHab4PQhMT9
//const jwtSecreatKey = "Dev@Tinder@799"
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}

module.exports = {
    connectDB
}
