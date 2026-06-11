const express = require('express');
const Employee = require('../models/Employee');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin ONLY: Get all employees
router.get('/', protect, admin, async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin ONLY: Create employee
router.post('/', protect, admin, async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Update employee
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Toggle availability
router.put('/:id/availability', protect, admin, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        employee.isAvailable = !employee.isAvailable;
        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Delete employee
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get available employees by category
router.get('/available/:category', async (req, res) => {
    try {
        const employees = await Employee.find({
            category: req.params.category,
            isAvailable: true,
            status: 'Active'
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
