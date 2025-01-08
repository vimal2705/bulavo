const Customer = require("../models/Customer");
const Order = require("../models/Order");

const createFormSubmission = async (req, res) => {
  const { 
    name, 
    email, 
    phoneNumber, 
    alternativePhoneNumber, 
    service, 
    address, 
    pincode, 
    message 
  } = req.body;

  if (!name || !email || !phoneNumber || !service || !address || !pincode) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  try {
    // Check if customer already exists
    let customer = await Customer.findOne({ phoneNumber });
    console.log("asd",customer);
    

    if (!customer) {
      // Create new customer
      customer = new Customer({
        name,
        email,
        phoneNumber,
        alternativePhoneNumber,
        address,
        pincode,
        message,
      });

      await customer.save();
    }

    // Create an order
    const order = new Order({
      customerId: customer._id,
      service,
      address,
      pincode,
      message,
    });

    await order.save();

    res.status(201).json({ message: "Form submitted successfully", customer, order });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    console.error("Error creating form submission:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteFormSubmission = async (req, res) => {
    const { customerId } = req.params;
  
    try {
      // Find and delete the customer
      const customer = await Customer.findByIdAndDelete(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      // Delete all orders associated with this customer
      await Order.deleteMany({ customerId });
  
      res.status(200).json({ message: "Customer and associated orders deleted successfully" });
    } catch (error) {
      console.error("Error deleting form submission:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  const updateFormSubmission = async (req, res) => {
    const { customerId } = req.params;
    const {
      name,
      email,
      phoneNumber,
      alternativePhoneNumber,
      service,
      address,
      pincode,
      message,
    } = req.body;
  
    try {
      // Update the customer details
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { name, email, phoneNumber, alternativePhoneNumber, address, pincode, message },
        { new: true, runValidators: true }
      );
  
      if (!updatedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      // Optionally update associated order details
      if (service) {
        await Order.updateMany(
          { customerId },
          { service, address, pincode, message }
        );
      }
  
      res.status(200).json({ message: "Form submission updated successfully", updatedCustomer });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      console.error("Error updating form submission:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  
module.exports = { createFormSubmission,deleteFormSubmission,updateFormSubmission };
