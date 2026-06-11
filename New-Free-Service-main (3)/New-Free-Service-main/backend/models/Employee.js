const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    city: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    currentJobs: { type: Number, default: 0 },
    maxJobs: { type: Number, default: 5 },
    rating: { type: Number, default: 0 },
    bookingCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
