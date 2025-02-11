const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO", // Assuming your NGO model is named "NGO"
    required: true,
  },
  location: {
    type: [Number], // Array: [latitude, longitude]
    required: true,
    validate: {
      validator: (v) => v.length === 2 && v.every((coord) => typeof coord === "number"),
      message: "Location must contain latitude and longitude as numbers.",
    },
    index: "2dsphere", // Geospatial index
  },
  problemType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
    match: [/^\d{10}$/, "Contact number must be 10 digits."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Incident", incidentSchema);