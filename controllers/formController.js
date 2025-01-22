const Customer = require("../models/Customer");
const Order = require("../models/Order");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: "bulavoservices@gmail.com",
      pass: "iguf ofex xkew uvcf"
  }
});

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
      console.log("asd", customer);

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

      // Send email notification to admin
      const adminEmailHTML = `
      
          <h2>New Service Request</h2>
          <h3>Customer Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Alternative Phone:</strong> ${alternativePhoneNumber || 'N/A'}</p>
          <h3>Service Details:</h3>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Pincode:</strong> ${pincode}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
      `;

      // Send confirmation email to customer
      const customerEmailHTML = `
      <!DOCTYPE html>
<html lang="en">

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
        }

        .header {
            background-color: #FFD700;
            color: #000;
            text-align: center;
            padding: 20px;
        }

        .content {
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            margin: 20px auto;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            line-height: 1.6;
            text-align: center;
        }

        .content h2 {
            font-size: 18px;
            font-weight: bold;
        }

        .content p {
            margin: 10px 0;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #FFD700;
            color: #000;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Welcome to Bulavo</h1>
    </div>
    <div class="content">
        <h2>Thank you for booking a service!</h2>
            <p>Dear ${name},</p>
                <h3>Service Details:</h3>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Pincode:</strong> ${pincode}</p>
          <p>We will contact you at ${phoneNumber} to confirm the details.</p>
        <p>We have received your request and are thrilled to assist you.</p>
        <p>Our expert technician will arrive at your location at the scheduled time, ensuring convenience and quality service.</p>
        <p>If you have any questions or need to make changes to your booking, feel free to get in touch.</p>
        <a href="tel:+919328939099" class="button">Call Us Now</a>
    </div>
    <div class="footer">
        <p>&copy; 2024 Bulavo. All rights reserved.</p>
        <p>Ahmedabad | +91 9328939099</p>
    </div>
</body>

</html>
        
      `;

      // Send email to admin
      await transporter.sendMail({
          from: "bulavoservices@gmail.com",
          to: "bulavoservices@gmail.com",
          subject: 'New Service Request',
          html: adminEmailHTML
      });

      // Send confirmation email to customer
      await transporter.sendMail({
          from: "bulavoservices@gmail.com",
          to: email,
          subject: 'Service Request Confirmation',
          html: customerEmailHTML
      });

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
