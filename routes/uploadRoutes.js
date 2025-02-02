const express = require("express");
const Image = require("../models/Image");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images will be saved to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename will be the current timestamp + extension
  },
});

const upload = multer({ storage });

// Upload Multiple Images
router.post("/upload-multiple", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => {
      return { imageUrl: `/uploads/${file.filename}` }; // Store image URL (path)
    });

    // Save image URLs in MongoDB
    await Image.insertMany(imageUrls);

    res.json({ message: "Images uploaded successfully!", imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Error uploading images" });
  }
});

// Fetch all images
router.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 }); // Sort by most recent upload
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Error fetching images" });
  }
});

module.exports = router;
