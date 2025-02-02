const mongoose = require('mongoose');

// Schema Definition
const attendanceSchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: [true, "Staff name is required"],
    trim: true,
  },
  staffId: {
    type: String,
    required: [true, "Staff ID is required"],
    unique: false, // Allow same ID for different dates
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: [true, "Status is required"],
  },
}, { timestamps: true });

attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true }); // Prevent duplicate attendance for the same date

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
