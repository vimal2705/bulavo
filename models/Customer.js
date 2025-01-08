const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  alternativePhoneNumber: { type: String },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  message: { type: String },
});

module.exports = mongoose.model("Customer", customerSchema);
