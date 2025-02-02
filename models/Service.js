const mongoose = require('mongoose');

// Categories array (add or modify categories as needed)
const categories = ['Hair', 'Packages', 'Makeup', 'Facial', 'Skin' ];

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: categories,
    required: true,
  },
  time: {
    type: Number, // Duration in minutes
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // Store image URL or path
    required: true,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
