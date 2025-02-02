const express = require("express");
const Appointment = require("../models/Appointment");
const router = express.Router();
const moment = require("moment");

// 📌 Add Appointment (Already Present)
router.post("/add", async (req, res) => {
  try {
    const { customerName, contactNumber, service, appointmentDate, appointmentTime } = req.body;

    if (!customerName || !contactNumber || !service || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const appointment = new Appointment({
      customerName,
      contactNumber,
      service,
      appointmentDate,
      appointmentTime,
      status: "pending",  // Default status
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Fetch Today's Appointments (Already Present)
router.get("/today", async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");
    const appointments = await Appointment.find({ appointmentDate: today })
      .populate("service", "name")
      .select("customerName contactNumber appointmentTime service appointmentDate status");

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// 📌 Fetch Appointments by Date (New Route)
router.get("/by-date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const formattedDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");

    const appointments = await Appointment.find({ appointmentDate: formattedDate })
      .populate("service", "name")
      .select("customerName contactNumber appointmentTime service appointmentDate status");

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// 📌 Mark Appointment as Done (New Route)
router.put("/mark-done/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({ message: "Appointment marked as done.", appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Error updating appointment." });
  }
});

module.exports = router;
