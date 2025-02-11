const express = require("express");
const router = express.Router();
const Incident = require("../models/incidentModel");
const NGO = require("../models/ngoModel");
const cloudinary = require("../config/cloudinary");
const transporter = require("../config/emailConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Configure Multer and Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "incident-reports",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

router.get("/ngos", async (req, res) => {
  const { city, lat, lng } = req.query;
  console.log(NGO.find());
  console.log(city);
  try {
    if (city) {
      const ngosByCity = await NGO.find({ city: city });
      return ngosByCity.length > 0
        ? res.json(ngosByCity)
        : res.status(404).json({ message: `No NGOs found in ${city}.` });
    } else if (lat && lng) {
      const maxDistance = 20;
      const ngos = await NGO.find();
      const nearbyNgos = ngos.filter(
        (ngo) =>
          calculateDistance(lat, lng, ngo.latitude, ngo.longitude) <=
          maxDistance
      );
      return nearbyNgos.length > 0
        ? res.json(nearbyNgos)
        : res
            .status(404)
            .json({ message: "No NGOs found near your location." });
    } else {
      return res.status(400).json({
        message:
          "Please provide either a city or your location (latitude and longitude).",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch NGOs." });
  }
});

// Report Incident and Send Email
router.post("/report-incident", async (req, res) => {
  try {
    const {
      ngoId,
      location,
      problemType,
      description,
      contactNumber,
      photoUrl,
    } = req.body;

    if (!ngoId || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the specified NGO
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Create and save the incident
    const incidentData = {
      ngoId,
      location,
      problemType,
      description,
      contactNumber,
      photoUrl,
    };
    const incident = new Incident(incidentData);
    await incident.save();

    // Generate Google Maps route link
    const mapLink = `https://www.google.com/maps/dir/${ngo.location[0]},${ngo.location[1]}/${location[0]},${location[1]}`;

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ngo.email,
      subject: `Incident Report - ${problemType}`,
      html: `
        <p>Dear ${ngo.name},</p>
        <p>A new incident has been reported near your location. Below are the details:</p>
        <ul>
          <li><strong>Problem Type:</strong> ${problemType}</li>
          <li><strong>Description:</strong> ${description}</li>
          <li><strong>Contact Number:</strong> ${
            contactNumber || "Not Provided"
          }</li>
          <li><strong>Photo:</strong> ${
            photoUrl
              ? `<a href="${photoUrl}" target="_blank">View Photo</a>`
              : "No Photo Provided"
          }</li>
        </ul>
        <p><strong>View Route:</strong> <a href="${mapLink}" target="_blank">${mapLink}</a></p>
        <p>Please take appropriate action.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Incident reported and email sent successfully." });
  } catch (error) {
    console.error("Error in report-incident:", error);
    res.status(500).json({ error: "Failed to report incident" });
  }
});

module.exports = router;
