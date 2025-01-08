const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

        name:   
         { type: String,
        required: true,
        unique: true,
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
    mobileNo: { 
        type: String, 
        sparse: true,  // This allows multiple documents to omit this field
        unique: true   // Only enforced when the field exists
    }
    // appointment: {
    //     type: [{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Appointment',
    //     }]
    // },
}, { timestamps: true, })

module.exports = mongoose.model('Admin', adminSchema)