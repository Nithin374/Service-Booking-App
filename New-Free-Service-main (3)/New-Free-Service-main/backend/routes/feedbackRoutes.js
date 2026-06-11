const express = require('express');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc Submit feedback for a completed booking
// @access Private
router.post('/', protect, async (req, res) => {
    try {
        const { bookingId, employeeId, serviceId, rating, comment } = req.body;

        // Validate required fields
        if (!bookingId || !employeeId || !serviceId || !rating) {
            return res.status(400).json({ message: 'Booking ID, Employee ID, Service ID, and rating are required' });
        }

        // Validate rating is between 1-5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Create feedback
        const feedback = new Feedback({
            bookingId,
            userId: req.user._id,
            employeeId,
            serviceId,
            rating,
            comment: comment || '',
            status: 'submitted'
        });

        const savedFeedback = await feedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: savedFeedback
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Get feedback for a booking
// @access Public
router.get('/booking/:bookingId', async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ bookingId: req.params.bookingId })
            .populate('userId', 'name')
            .populate('employeeId', 'name')
            .populate('serviceId', 'title category');
        
        if (!feedback) {
            return res.json(null);
        }

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get all feedback for an employee
// @access Public
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ employeeId: req.params.employeeId })
            .populate('userId', 'name')
            .populate('serviceId', 'title')
            .sort({ createdAt: -1 });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get user's feedback submissions
// @access Private
router.get('/my-feedback', protect, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user._id })
            .populate('employeeId', 'name')
            .populate('serviceId', 'title')
            .populate('bookingId', 'status')
            .sort({ createdAt: -1 });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
