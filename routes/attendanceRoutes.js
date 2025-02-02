const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Add new attendance record
router.post('/attendance/mark', async (req, res) => {
  try {
    const attendanceRecords = req.body;

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({ message: "Attendance records are required" });
    }

    // Iterate over each attendance record and save it
    const savedRecords = [];
    for (let record of attendanceRecords) {
      const { staffId, staffName, status, date } = record;

      if (!staffId || !staffName || !status || !date) {
        continue; // Skip invalid records
      }

      // Validate status
      if (!['Present', 'Absent'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      // Check if the attendance already exists for this staff on this date
      const existingRecord = await Attendance.findOne({ staffId, date });
      if (existingRecord) {
        return res.status(400).json({ message: `Attendance already recorded for ${staffName} on ${date}` });
      }

      // Create and save the new attendance record
      const attendance = new Attendance({ staffId, staffName, status, date });
      const savedAttendance = await attendance.save();
      savedRecords.push(savedAttendance);
    }

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: savedRecords,
    });
  } catch (error) {
    console.error('Error marking attendance:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});


// Add new staff (just add to Attendance as you already have staff details)
router.post('/staff', async (req, res) => {
  try {
    const { staffId, staffName } = req.body;

    // Validate staff details
    if (!staffId || !staffName) {
      return res.status(400).json({ message: 'Staff ID and name are required' });
    }

    // Optionally check if the staff already exists in the attendance records
    const existingStaff = await Attendance.findOne({ staffId });
    if (existingStaff) {
      return res.status(400).json({ message: `Staff with ID ${staffId} already exists` });
    }

    // Create a dummy attendance record just to store the staff information
    const attendance = new Attendance({ staffId, staffName, date: new Date(), status: 'Absent' });

    // Save the attendance entry (staff is now "added")
    await attendance.save();

    res.status(201).json({
      message: 'Staff added successfully',
      staff: { staffId, staffName },
    });
  } catch (error) {
    console.error('Error adding staff:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});


// Fetch attendance records by date (or all records)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;

    let filter = {};
    if (date) {
      filter.date = new Date(date);
    }

    const attendance = await Attendance.find(filter);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get attendance record for a specific staff member by date
router.get('/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    const { date } = req.query;

    let filter = { staffId };
    if (date) {
      filter.date = new Date(date);
    }

    const attendance = await Attendance.find(filter);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update attendance status for a specific record
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const attendance = await Attendance.findByIdAndUpdate(id, { status }, { new: true });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({
      message: 'Attendance updated successfully',
      attendance,
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a specific attendance record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({
      message: 'Attendance record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
