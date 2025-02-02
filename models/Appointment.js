const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,  // Ensure contactNumber is required
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true, // Ensure appointmentDate is provided
  },
  appointmentTime: {
    type: String,
    required: true, // Ensure appointmentTime is required
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});
module.exports = mongoose.model("Appointment", appointmentSchema);
