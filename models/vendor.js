const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Ensure phone numbers are unique
    match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"], // Validates E.164 format
  },
  status: {
    type: String,
    enum: ["verified", "unverified"], // Allow only specific statuses
    default: "unverified", // Default status
  },
  totalEarning: {
    type: Number,
    default: 0, // Default value for total earnings
  },
  earning: {
    type: Number,
    default: 0, // Default value for current earnings
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
