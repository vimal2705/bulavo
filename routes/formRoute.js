const express = require("express");
const router = express.Router();
const { 
  createFormSubmission, 
  deleteFormSubmission, 
  updateFormSubmission 
} = require("../controllers/formController");
const Customer = require("../models/Customer");

// Create form submission
router.post("/submitform", createFormSubmission);
router.get('/allcustomers', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json({ customers });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers.' });
    }
  });
  
  module.exports = router;
// Delete form submission
router.delete("/form/:customerId", deleteFormSubmission);

// Update form submission
router.put("/form/:customerId", updateFormSubmission);

module.exports = router;
