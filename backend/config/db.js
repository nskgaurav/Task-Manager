const mongoose = require("mongoose");

const MongoURI = process.env.MONGOURL;

async function connectTOMongo() {
    console.log("connected to the database");
    try {
        let x = await mongoose.connect(MongoURI);
        console.log("Database name is : ", x.connections[0].name);
        return true;
    } catch (error) {
        console.log(error.message);
        return false;

    }
}

module.exports = connectTOMongo;