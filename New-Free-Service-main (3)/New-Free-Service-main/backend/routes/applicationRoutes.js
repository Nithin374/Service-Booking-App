const express = require('express');
const Application = require('../models/Application');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Submit a new partner application
router.post('/', async (req, res) => {
    try {
        const app = new Application(req.body);
        await app.save();
        res.status(201).json(app);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Get all applications
router.get('/', protect, admin, async (req, res) => {
    try {
        const apps = await Application.find()
            .populate('assignedEmployeeId', 'name email')
            .sort({ createdAt: -1 });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin ONLY: Approve an application and auto-assign pending jobs
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        // Check if already approved or rejected
        if (app.status === 'Approved') {
            return res.status(400).json({ message: 'Application already approved' });
        }
        if (app.status === 'Rejected') {
            return res.status(400).json({ message: 'Application already rejected' });
        }
        
        // Set maxJobs based on category
        const maxJobsByCategory = {
            'Plumbing': 7,
            'Beauty Salon': 6,
            'Cleaning': 4,
            'Water Purifier': 4,
            'Air Conditioner': 5,
            'Refrigerator': 5,
            'Electrical': 6,
            'Geyser': 5,
            'Washing Machine': 5
        };
        
        const maxJobs = maxJobsByCategory[app.category] || 5; // Default to 5 if not found
        
        // Create Employee record from Application
        const employeeEmail = app.email || `${app.fullName.toLowerCase().replace(/\s+/g, '.')}@freeservice.com`;
        
        // Create User account for employee login
        const defaultPassword = `${app.fullName.toLowerCase().replace(/\s+/g, '')}.${Math.random().toString(36).substring(2, 8)}`;
        
        let userAccount;
        try {
            userAccount = await User.create({
                name: app.fullName,
                email: employeeEmail,
                password: defaultPassword,
                role: 'provider'
            });
            console.log(`Created User account for ${app.fullName} with email ${employeeEmail}`);
        } catch (userError) {
            // If user already exists, just continue with employee creation
            if (userError.code === 11000) {
                console.log(`User account already exists for ${employeeEmail}`);
                userAccount = await User.findOne({ email: employeeEmail });
            } else {
                throw userError;
            }
        }
        
        const newEmployee = new Employee({
            name: app.fullName,
            email: employeeEmail,
            phone: app.phone,
            category: app.category,
            experience: app.experience,
            city: app.city,
            isAvailable: true,
            currentJobs: 0,
            maxJobs: maxJobs,
            rating: 0,
            bookingCount: 0,
            status: 'Active'
        });
        
        const savedEmployee = await newEmployee.save();
        
        // Find all services matching this employee's category
        const matchingServices = await Service.find({ category: app.category }).select('_id');
        const serviceIds = matchingServices.map(s => s._id);
        
        // Find pending bookings for matching services
        const pendingBookings = await Booking.find({
            serviceId: { $in: serviceIds },
            employeeId: null,
            status: 'Pending'
        }).limit(maxJobs);
        
        console.log(`Auto-assigning up to ${maxJobs} pending bookings of category ${app.category} to employee ${savedEmployee.name}`);
        console.log(`Found ${pendingBookings.length} pending bookings to assign`);
        
        // Auto-assign bookings up to maxJobs capacity
        let assignedCount = 0;
        for (let i = 0; i < pendingBookings.length && i < maxJobs; i++) {
            const booking = pendingBookings[i];
            booking.employeeId = savedEmployee._id;
            booking.status = 'Confirmed';
            await booking.save();
            assignedCount++;
        }
        
        // Update employee's currentJobs
        if (assignedCount > 0) {
            savedEmployee.currentJobs = assignedCount;
            await savedEmployee.save();
            console.log(`Assigned ${assignedCount} jobs to ${savedEmployee.name}`);
        }
        
        // Update Application with approval and employee reference
        const updatedApp = await Application.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'Approved',
                assignedEmployeeId: savedEmployee._id,
                assignedBy: req.user._id
            },
            { new: true }
        ).populate('assignedEmployeeId', 'name email');
        
        res.json({ 
            success: true, 
            message: `Application approved and employee created. Auto-assigned ${assignedCount} pending jobs.`, 
            application: updatedApp,
            jobsAssigned: assignedCount,
            employeeCredentials: {
                email: employeeEmail,
                password: defaultPassword,
                note: 'Share these credentials with the employee so they can log in to their dashboard'
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Reject an application
router.put('/:id/reject', protect, admin, async (req, res) => {
    try {
        const app = await Application.findByIdAndUpdate(
            req.params.id, 
            { status: 'Rejected' },
            { new: true }
        );
        if (!app) return res.status(404).json({ message: 'Application not found' });
        res.json(app);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Assign job to an employee
router.put('/:id/assign', protect, admin, async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }
        
        const app = await Application.findByIdAndUpdate(
            req.params.id,
            {
                assignedEmployeeId: employeeId,
                assignedBy: req.user._id,
                status: 'Approved'
            },
            { new: true }
        ).populate('assignedEmployeeId', 'name email');
        
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        // Increment employee's currentJobs
        const employee = await Employee.findById(employeeId);
        if (employee && employee.currentJobs < employee.maxJobs) {
            await Employee.findByIdAndUpdate(
                employeeId,
                { $inc: { currentJobs: 1, bookingCount: 1 } }
            );
        } else {
            return res.status(400).json({ message: 'Employee has reached maximum jobs capacity' });
        }
        
        res.json({ success: true, message: 'Job assigned successfully', application: app });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Assign job to an employee (POST variant for compatibility)
router.put('/:id/assign-job', protect, admin, async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }
        
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        // Check if employee has capacity
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        if (employee.currentJobs >= employee.maxJobs) {
            return res.status(400).json({ message: `Employee has reached maximum jobs capacity (${employee.maxJobs})` });
        }
        
        // Update application
        const updatedApp = await Application.findByIdAndUpdate(
            req.params.id,
            {
                assignedEmployeeId: employeeId,
                assignedBy: req.user._id,
                allocatedSlot: 'Assigned'
            },
            { new: true }
        ).populate('assignedEmployeeId', 'name email');
        
        // Increment employee's currentJobs
        await Employee.findByIdAndUpdate(
            employeeId,
            { $inc: { currentJobs: 1, bookingCount: 1 } }
        );
        
        res.json({ success: true, message: 'Job assigned successfully', application: updatedApp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin ONLY: Allocate slot to an application (Legacy)
router.put('/:id/allocate', protect, admin, async (req, res) => {
    try {
        const { slot } = req.body;
        const app = await Application.findByIdAndUpdate(req.params.id, {
            status: 'Approved',
            allocatedSlot: slot
        }, { new: true });
        res.json(app);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
