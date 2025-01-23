import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middleware
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
