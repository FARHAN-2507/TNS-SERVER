const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
