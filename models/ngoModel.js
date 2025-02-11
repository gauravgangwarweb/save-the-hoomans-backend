const mongoose = require('mongoose')

const ngoSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  services: String,
  email: String,
  location: {
    type: [Number],  // Array of numbers [longitude, latitude]
    index: '2dsphere' // Adding geospatial index for location queries
  },
  ratings: Number
})

module.exports = mongoose.model('NGO', ngoSchema)