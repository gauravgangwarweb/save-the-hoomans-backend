import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app = express();

//middleware
app.use(bodyParser.json());

//routes
app.use("/api", ngoRoutes);

//connect to db
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
