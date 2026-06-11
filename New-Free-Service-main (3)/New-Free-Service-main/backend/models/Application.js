const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    allocatedSlot: { type: String, default: 'Not assigned yet' },
    assignedEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    assignedBy: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
