require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });

app.use("/api", userRoutes);
app.use("/api", studentRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
