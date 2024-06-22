require("dotenv").config();
const express = require("express");
const app = express();
const connectToMongo = require("./config/db");
const cors = require("cors")
connectToMongo();
app.use(express.json());

app.use(cors())

app.use("/api/task", require("./routes/taskRoute"))


app.get("/",(req,res)=>{
    res.send("End Point Working");

});


const port = process.env.PORT || 4000;
app.listen(port,(req,res)=>{
console.log(`App running on port no ${port}`);
});
