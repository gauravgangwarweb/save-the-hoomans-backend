const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ngoRoutes = require('./routes/ngoRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', ngoRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Animal Welfare NGO Finder API');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
