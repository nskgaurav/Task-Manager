require("dotenv").config();
const express = require("express");
const app = express(); // Corrected initialization

// Database connection
const connectToMongo = require("./config/db");
connectToMongo();

// Packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Middleware setup
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Routes
app.use("/api/tasks", require("./routes/taskRoute"));

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Our Ecommerce App!!</h1>")
})


const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`${process.env.DEV_MODE} is listening on port ${port}`);
});
