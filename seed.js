const mongoose = require("mongoose");
const NGO = require("./models/ngoModel");
const fs = require("fs");
require('dotenv').config();

const jsonData = JSON.parse(fs.readFileSync("ngo-data.json"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  try {
    await NGO.deleteMany(); // Clear existing records if needed
    await NGO.insertMany(jsonData);
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    mongoose.connection.close();
  }
});
