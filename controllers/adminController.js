const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/admin');

exports.createAdmin = async (req, res) => {
    const { name, email, password, mobileNo } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ 
            status: false,
            message: "Name, email and password are required" 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Only include mobileNo if it's provided
        const adminData = {
            name,
            email,
            password: hashedPassword
        };
        
        if (mobileNo) {
            adminData.mobileNo = mobileNo;
        }

        const newAdmin = new Admin(adminData);
        const savedAdmin = await newAdmin.save();

        return res.status(201).json({
            status: true,
            message: "Admin registered successfully",
            data: {
                id: savedAdmin._id,
                name: savedAdmin.name,
                email: savedAdmin.email,
                mobileNo: savedAdmin.mobileNo
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            // Determine which field caused the duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                status: false,
                message: `${field === 'email' ? 'Email' : 'Mobile number'} already exists`
            });
        }

        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().sort({ updatedAt: -1 });
        res.status(200).json({ data: admins, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the admins', status: false, message: 'Failed', });
    }
}

exports.getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);
        res.status(200).json({ data: admin, message: 'Success', status: true })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the admin', status: false, message: 'Failed', });
    }
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required"
        });
    }

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(404).json({
                status: false,
                message: "Admin not found"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id,
                email: admin.email,
                role: 'admin'
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send success response
        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                token,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            }
        });

    } catch (error) {
        console.error('Login error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        // Handle specific errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(500).json({
                status: false,
                message: "Error generating token"
            });
        }

        // Generic error response
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};