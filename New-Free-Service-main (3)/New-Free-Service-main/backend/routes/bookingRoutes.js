const express = require('express');
const Booking = require('../models/Booking');
const Employee = require('../models/Employee');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Book a service
router.post('/', protect, async (req, res) => {
    try {
        const { serviceId, userName, userPhone, location, userAddress, appointmentDate, totalAmount, paymentMethod } = req.body;
        
        // Validate required fields
        if (!serviceId || !userName || !userPhone || !location || !userAddress || !appointmentDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Validate total amount
        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ message: 'Invalid booking amount' });
        }
        
        // Validate appointment date (cannot be in the past)
        if (new Date(appointmentDate) < new Date()) {
            return res.status(400).json({ message: 'Cannot book for past dates' });
        }
        
        const newBooking = new Booking({
            ...req.body,
            userId: req.user._id
        });
        const savedBooking = await newBooking.save();
        
        // If employee is assigned, increment their job counts
        if (savedBooking.employeeId) {
            await Employee.findByIdAndUpdate(
                savedBooking.employeeId,
                { $inc: { bookingCount: 1, currentJobs: 1 } }
            );
        }
        
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Get current user's bookings
// @access Private
router.get('/mybookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('serviceId')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get all bookings
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('serviceId')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get top 50 frequent employees for a service
// @access Public
router.get('/employees/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        
        // Get the service to find category
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        // Get top 50 employees by category and booking count (frequency)
        const employees = await Employee.find({ 
            category: service.category,
            status: 'Active',
            isAvailable: true
        })
        .sort({ bookingCount: -1, rating: -1 })
        .limit(50);
        
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Update booking status (Admin Accept & Assign Employee)
// @access Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            const oldStatus = booking.status;
            const newStatus = req.body.status || 'Confirmed';
            booking.status = newStatus;
            
            // If admin is assigning an employee
            if (req.body.employeeId && !booking.employeeId) {
                const employee = await Employee.findById(req.body.employeeId);
                
                // Check if employee is available
                if (employee && !employee.isAvailable) {
                    return res.status(400).json({ message: `Employee ${employee.name} is currently unavailable` });
                }
                
                // Check if employee has reached max jobs
                if (employee && employee.currentJobs >= employee.maxJobs) {
                    return res.status(400).json({ message: `Employee ${employee.name} has reached maximum jobs capacity (${employee.maxJobs})` });
                }
                
                booking.employeeId = req.body.employeeId;
                // Increment both booking count and current jobs
                await Employee.findByIdAndUpdate(
                    req.body.employeeId,
                    { $inc: { bookingCount: 1, currentJobs: 1 } }
                );
            }
            
            // Handle job completion or cancellation
            if (booking.employeeId && (newStatus === 'Completed' || newStatus === 'Cancelled') && 
                (oldStatus === 'Pending' || oldStatus === 'Confirmed')) {
                // Decrement currentJobs when booking is completed or cancelled
                await Employee.findByIdAndUpdate(
                    booking.employeeId,
                    { $inc: { currentJobs: -1 } }
                );
            }
            
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Employee marks work as finished
// @access Private/Protected
router.put('/:id/employee-finished', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId')
            .populate('serviceId')
            .populate('employeeId');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Employee can only mark their own bookings as finished
        if (booking.employeeId && booking.employeeId._id.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin' && booking.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        // Only can mark finished if status is Confirmed
        if (booking.status !== 'Confirmed') {
            return res.status(400).json({ message: 'Can only mark finished for Confirmed bookings' });
        }
        
        // Mark as finished
        booking.employeeFinished = new Date();
        const updatedBooking = await booking.save();
        
        res.json({ 
            message: 'Work marked as finished', 
            booking: updatedBooking 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Customer confirms work completion
// @access Private
router.put('/:id/confirm-completion', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Only customer (userId) can confirm completion
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to confirm' });
        }
        
        // Can only confirm if employee marked as finished
        if (!booking.employeeFinished) {
            return res.status(400).json({ message: 'Employee has not marked work as finished yet' });
        }
        
        // Update status to Completed
        booking.status = 'Completed';
        const updatedBooking = await booking.save();
        
        // Decrement employee current jobs
        if (booking.employeeId) {
            await Employee.findByIdAndUpdate(
                booking.employeeId,
                { $inc: { currentJobs: -1 } }
            );
        }
        
        res.json({ 
            message: 'Work confirmed as completed', 
            booking: updatedBooking 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
