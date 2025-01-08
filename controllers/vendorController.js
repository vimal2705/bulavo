const bcrypt = require("bcrypt");
const Vendor = require("../models/vendor");

const createVendor = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
  
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newVendor = new Vendor({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
      });
  
      await newVendor.save();
      return res
        .status(201)
        .json({ message: "Vendor created successfully", vendor: newVendor });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email or phone number already exists" });
      }
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  

const jwt = require("jsonwebtoken");

const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const editVendor = async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, status, totalEarning, earning } = req.body;
  
    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
        id,
        { name, email, phoneNumber, status, totalEarning, earning },
        { new: true, runValidators: true }
      );
  
      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      return res.status(200).json({ message: "Vendor updated successfully", vendor: updatedVendor });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email or phone number already exists" });
      }
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  
  const listVendors = async (req, res) => {
    try {
      const vendors = await Vendor.find({}, { password: 0 }); // Exclude password
      return res.status(200).json({ vendors });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  
  const deleteVendor = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedVendor = await Vendor.findByIdAndDelete(id);
  
      if (!deletedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      return res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  module.exports = {
    createVendor,
    loginVendor,
    listVendors,
    editVendor,
    deleteVendor,
  };
  