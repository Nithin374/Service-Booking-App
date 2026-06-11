const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    location: { type: String, required: true }, // Added location field
    userAddress: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true, default: 'online' },
    totalAmount: { type: Number, required: true, default: 0 }, // Added totalAmount field
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    employeeFinished: { type: Date, default: null } // Timestamp when employee marks work as finished
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
