
const express = require("express");
const {
  createVendor,
  loginVendor,
  listVendors,
  editVendor,
  deleteVendor,
} = require("../controllers/vendorController");

const router = express.Router();

router.post("/create", createVendor); // Create vendor
router.post("/login", loginVendor); // Login vendor
router.get("/", listVendors); // List all vendors
router.put("/:id", editVendor); // Edit vendor by ID
router.delete("/:id", deleteVendor); // Delete vendor by ID

module.exports = router;
