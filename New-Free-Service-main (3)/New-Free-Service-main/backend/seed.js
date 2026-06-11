const mongoose = require('mongoose');
const Service = require('./models/Service');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Employee = require('./models/Employee');

const initialServices = [
    {
        title: 'Air Conditioner',
        description: 'Expert AC repair, servicing, and installation at your doorstep.',
        category: 'Air Conditioner',
        price: 999,
        imageIcon: '❄️'
    },
    {
        title: 'Beauty Salon at Home',
        description: 'Professional beauty services including waxing, facials, and manicure.',
        category: 'Beauty Salon',
        price: 1499,
        imageIcon: '💄'
    },
    {
        title: 'Refrigerator',
        description: 'Fix cooling issues, gas leaks, and door seals for all major brands.',
        category: 'Refrigerator',
        price: 1200,
        imageIcon: '🧊'
    },
    {
        title: 'Plumber',
        description: 'Fast and reliable plumbing services for leaks and installations.',
        category: 'Plumbing',
        price: 499,
        imageIcon: '🔧'
    },
    {
        title: 'Electrician',
        description: 'Expert electrical services from wiring to appliance repair.',
        category: 'Electrical',
        price: 399,
        imageIcon: '⚡'
    },
    {
        title: 'Geyser',
        description: 'Electric and Gas geyser heating issues, power issues, and installation.',
        category: 'Geyser',
        price: 699,
        imageIcon: '♨️'
    },
    {
        title: 'Home Cleaning',
        description: 'Deep cleaning for the kitchen, bathroom, sofa, and full home.',
        category: 'Cleaning',
        price: 2499,
        imageIcon: '🧹'
    },
    {
        title: 'Washing Machine',
        description: 'Repair and servicing for top-load and front-load washing machines.',
        category: 'Washing Machine',
        price: 899,
        imageIcon: '🧺'
    },
    {
        title: 'Water Purifier',
        description: 'RO repair, filter change, and installation services.',
        category: 'Water Purifier',
        price: 599,
        imageIcon: '💧'
    }
];

const initialEmployees = [
    // Air Conditioner - 6 employees
    { name: 'Suresh Kumar', email: 'rajesh.ac@email.com', phone: '9876543210', category: 'Air Conditioner', experience: 8, city: 'Chennai', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.9, bookingCount: 145, status: 'Active' },
    { name: 'Ramesh Iyer', email: 'amit.ac@email.com', phone: '9876543211', category: 'Air Conditioner', experience: 6, city: 'Coimbatore', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.8, bookingCount: 128, status: 'Active' },
    { name: 'Vikram Samy', email: 'vikram.ac@email.com', phone: '9876543212', category: 'Air Conditioner', experience: 7, city: 'Madurai', isAvailable: false, currentJobs: 3, maxJobs: 5, rating: 4.7, bookingCount: 112, status: 'On Leave' },
    { name: 'Sanjay Reddy', email: 'suresh.ac@email.com', phone: '9876543213', category: 'Air Conditioner', experience: 5, city: 'Salem', isAvailable: true, currentJobs: 0, maxJobs: 5, rating: 4.6, bookingCount: 95, status: 'Active' },
    { name: 'Arun Kannan', email: 'arun.ac@email.com', phone: '9876543214', category: 'Air Conditioner', experience: 4, city: 'Tiruchirappalli', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.5, bookingCount: 78, status: 'Active' },
    { name: 'Deepak Nair', email: 'deepak.ac@email.com', phone: '9876543215', category: 'Air Conditioner', experience: 3, city: 'Erode', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.4, bookingCount: 62, status: 'Active' },

    // Beauty Salon - 6 employees
    { name: 'Priya Krishnan', email: 'priya.salon@email.com', phone: '9876543216', category: 'Beauty Salon', experience: 9, city: 'Kanchipuram', isAvailable: true, currentJobs: 2, maxJobs: 6, rating: 4.9, bookingCount: 156, status: 'Active' },
    { name: 'Neha Muthusamy', email: 'neha.salon@email.com', phone: '9876543217', category: 'Beauty Salon', experience: 7, city: 'Vellore', isAvailable: true, currentJobs: 3, maxJobs: 6, rating: 4.8, bookingCount: 142, status: 'Active' },
    { name: 'Anjali Sundaram', email: 'anjali.salon@email.com', phone: '9876543218', category: 'Beauty Salon', experience: 6, city: 'Tiruppur', isAvailable: true, currentJobs: 1, maxJobs: 6, rating: 4.7, bookingCount: 128, status: 'Active' },
    { name: 'Kavya Ramnath', email: 'kavya.salon@email.com', phone: '9876543219', category: 'Beauty Salon', experience: 5, city: 'Cuddalore', isAvailable: true, currentJobs: 2, maxJobs: 6, rating: 4.6, bookingCount: 105, status: 'Active' },
    { name: 'Sneha Varma', email: 'sneha.salon@email.com', phone: '9876543220', category: 'Beauty Salon', experience: 4, city: 'Villupuram', isAvailable: false, currentJobs: 0, maxJobs: 6, rating: 4.5, bookingCount: 89, status: 'Inactive' },
    { name: 'Divya Prasad', email: 'divya.salon@email.com', phone: '9876543221', category: 'Beauty Salon', experience: 3, city: 'Ranipet', isAvailable: true, currentJobs: 1, maxJobs: 6, rating: 4.4, bookingCount: 71, status: 'Active' },

    // Refrigerator - 6 employees
    { name: 'Mohan Reddy', email: 'mohan.fridge@email.com', phone: '9876543222', category: 'Refrigerator', experience: 10, city: 'Kanyakumari', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.9, bookingCount: 167, status: 'Active' },
    { name: 'Ramesh Iyer', email: 'ramesh.fridge@email.com', phone: '9876543223', category: 'Refrigerator', experience: 8, city: 'Tirunelveli', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.8, bookingCount: 135, status: 'Active' },
    { name: 'Prakash Rao', email: 'prakash.fridge@email.com', phone: '9876543224', category: 'Refrigerator', experience: 7, city: 'Thoothukudi', isAvailable: true, currentJobs: 0, maxJobs: 5, rating: 4.7, bookingCount: 118, status: 'Active' },
    { name: 'Sunil Krishnan', email: 'sunil.fridge@email.com', phone: '9876543225', category: 'Refrigerator', experience: 6, city: 'Pudukottai', isAvailable: true, currentJobs: 3, maxJobs: 5, rating: 4.6, bookingCount: 102, status: 'Active' },
    { name: 'Naveen Kumar', email: 'naveen.fridge@email.com', phone: '9876543226', category: 'Refrigerator', experience: 5, city: 'Thanjavur', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.5, bookingCount: 85, status: 'Active' },
    { name: 'Karthik Samy', email: 'karthik.fridge@email.com', phone: '9876543227', category: 'Refrigerator', experience: 4, city: 'Tenkasi', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.3, bookingCount: 68, status: 'Active' },

    // Plumbing - 6 employees
    { name: 'Ravi Shankar', email: 'ravi.plumb@email.com', phone: '9876543228', category: 'Plumbing', experience: 12, city: 'Karur', isAvailable: true, currentJobs: 2, maxJobs: 7, rating: 4.9, bookingCount: 178, status: 'Active' },
    { name: 'Sanjay Murthy', email: 'sanjay.plumb@email.com', phone: '9876543229', category: 'Plumbing', experience: 9, city: 'Nilgiris', isAvailable: true, currentJobs: 1, maxJobs: 7, rating: 4.8, bookingCount: 152, status: 'Active' },
    { name: 'Mahesh Rao', email: 'mahesh.plumb@email.com', phone: '9876543230', category: 'Plumbing', experience: 8, city: 'Dharmapuri', isAvailable: true, currentJobs: 3, maxJobs: 7, rating: 4.7, bookingCount: 135, status: 'Active' },
    { name: 'Arjun Nair', email: 'harendra.plumb@email.com', phone: '9876543231', category: 'Plumbing', experience: 7, city: 'Krishnagiri', isAvailable: true, currentJobs: 0, maxJobs: 7, rating: 4.6, bookingCount: 118, status: 'Active' },
    { name: 'Ajay Reddy', email: 'ajay.plumb@email.com', phone: '9876543232', category: 'Plumbing', experience: 6, city: 'Perambalur', isAvailable: false, currentJobs: 2, maxJobs: 7, rating: 4.5, bookingCount: 98, status: 'On Leave' },
    { name: 'Bhavesh Iyer', email: 'bhavesh.plumb@email.com', phone: '9876543233', category: 'Plumbing', experience: 5, city: 'Namakkal', isAvailable: true, currentJobs: 1, maxJobs: 7, rating: 4.4, bookingCount: 82, status: 'Active' },

    // Electrical - 6 employees
    { name: 'Ashok Goel', email: 'ashok.elec@email.com', phone: '9876543234', category: 'Electrical', experience: 11, city: 'Ariyalur', isAvailable: true, currentJobs: 1, maxJobs: 6, rating: 4.9, bookingCount: 165, status: 'Active' },
    { name: 'Rohan Das', email: 'rohan.elec@email.com', phone: '9876543235', category: 'Electrical', experience: 9, city: 'Kallakurichi', isAvailable: true, currentJobs: 2, maxJobs: 6, rating: 4.8, bookingCount: 145, status: 'Active' },
    { name: 'Varun Krishna', email: 'varun.elec@email.com', phone: '9876543236', category: 'Electrical', experience: 8, city: 'Mayiladuthurai', isAvailable: true, currentJobs: 3, maxJobs: 6, rating: 4.7, bookingCount: 128, status: 'Active' },
    { name: 'Pradeep Sharma', email: 'pradeep.elec@email.com', phone: '9876543237', category: 'Electrical', experience: 7, city: 'Nagapattinam', isAvailable: true, currentJobs: 1, maxJobs: 6, rating: 4.6, bookingCount: 108, status: 'Active' },
    { name: 'Sachin Menon', email: 'sachin.elec@email.com', phone: '9876543238', category: 'Electrical', experience: 6, city: 'Ramanathapuram', isAvailable: true, currentJobs: 2, maxJobs: 6, rating: 4.5, bookingCount: 92, status: 'Active' },
    { name: 'Nikhil Parthasarathy', email: 'nikhil.elec@email.com', phone: '9876543239', category: 'Electrical', experience: 5, city: 'Sivaganga', isAvailable: true, currentJobs: 0, maxJobs: 6, rating: 4.3, bookingCount: 75, status: 'Active' },

    // Washing Machine - 5 employees
    { name: 'Arjun Prasad', email: 'arjun.wash@email.com', phone: '9876543240', category: 'Washing Machine', experience: 7, city: 'Tirupattur', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.8, bookingCount: 125, status: 'Active' },
    { name: 'Girish Murthy', email: 'girish.wash@email.com', phone: '9876543241', category: 'Washing Machine', experience: 6, city: 'Tiruvallur', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.7, bookingCount: 108, status: 'Active' },
    { name: 'Anand Kumar', email: 'anand.wash@email.com', phone: '9876543242', category: 'Washing Machine', experience: 5, city: 'Tiruvannamalai', isAvailable: true, currentJobs: 0, maxJobs: 5, rating: 4.6, bookingCount: 95, status: 'Active' },
    { name: 'Rathod Rao', email: 'rathod.wash@email.com', phone: '9876543243', category: 'Washing Machine', experience: 4, city: 'Tiruvarur', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.5, bookingCount: 78, status: 'Active' },
    { name: 'Sameer Khan', email: 'sameer.wash@email.com', phone: '9876543244', category: 'Washing Machine', experience: 3, city: 'Theni', isAvailable: false, currentJobs: 0, maxJobs: 5, rating: 4.4, bookingCount: 62, status: 'Inactive' },

    // Geyser - 5 employees
    { name: 'Harsh Verma', email: 'harsh.geyser@email.com', phone: '9876543245', category: 'Geyser', experience: 6, city: 'Dindigul', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.7, bookingCount: 115, status: 'Active' },
    { name: 'Sandeep Iyer', email: 'sandeep.geyser@email.com', phone: '9876543246', category: 'Geyser', experience: 5, city: 'Chengalpattu', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.6, bookingCount: 98, status: 'Active' },
    { name: 'Vikram Sundar', email: 'vikram.geyser@email.com', phone: '9876543247', category: 'Geyser', experience: 4, city: 'Viluppuram', isAvailable: true, currentJobs: 0, maxJobs: 5, rating: 4.5, bookingCount: 85, status: 'Active' },
    { name: 'Rajendra Rao', email: 'rajendra.geyser@email.com', phone: '9876543248', category: 'Geyser', experience: 3, city: 'Chengalpattu', isAvailable: true, currentJobs: 1, maxJobs: 5, rating: 4.4, bookingCount: 68, status: 'Active' },
    { name: 'Vikas Joshi', email: 'vikas.geyser@email.com', phone: '9876543249', category: 'Geyser', experience: 2, city: 'Kanchipuram', isAvailable: true, currentJobs: 2, maxJobs: 5, rating: 4.2, bookingCount: 52, status: 'Active' },

    // Water Purifier - 5 employees
    { name: 'Govind Shetty', email: 'govind.water@email.com', phone: '9876543250', category: 'Water Purifier', experience: 5, city: 'Vellore', isAvailable: true, currentJobs: 0, maxJobs: 4, rating: 4.7, bookingCount: 105, status: 'Active' },
    { name: 'Rakesh Murthy', email: 'rakesh.water@email.com', phone: '9876543251', category: 'Water Purifier', experience: 4, city: 'Ranipet', isAvailable: true, currentJobs: 1, maxJobs: 4, rating: 4.6, bookingCount: 88, status: 'Active' },
    { name: 'Sampath Reddy', email: 'sampath.water@email.com', phone: '9876543252', category: 'Water Purifier', experience: 3, city: 'Tiruppur', isAvailable: true, currentJobs: 2, maxJobs: 4, rating: 4.5, bookingCount: 75, status: 'Active' },
    { name: 'Siddharth Kumar', email: 'siddharth.water@email.com', phone: '9876543253', category: 'Water Purifier', experience: 2, city: 'Coimbatore', isAvailable: true, currentJobs: 1, maxJobs: 4, rating: 4.4, bookingCount: 58, status: 'Active' },
    { name: 'Aditya Nair', email: 'aditya.water@email.com', phone: '9876543254', category: 'Water Purifier', experience: 1, city: 'Erode', isAvailable: false, currentJobs: 0, maxJobs: 4, rating: 4.2, bookingCount: 42, status: 'On Leave' },

    // Cleaning - 5 employees
    { name: 'Ramakrishnan Iyer', email: 'rama.clean@email.com', phone: '9876543255', category: 'Cleaning', experience: 8, city: 'Madurai', isAvailable: true, currentJobs: 1, maxJobs: 4, rating: 4.8, bookingCount: 138, status: 'Active' },
    { name: 'Sundar Menon', email: 'sundar.clean@email.com', phone: '9876543256', category: 'Cleaning', experience: 7, city: 'Salem', isAvailable: true, currentJobs: 2, maxJobs: 4, rating: 4.7, bookingCount: 122, status: 'Active' },
    { name: 'Lakshman Dev', email: 'lakshman.clean@email.com', phone: '9876543257', category: 'Cleaning', experience: 6, city: 'Tiruchirappalli', isAvailable: true, currentJobs: 0, maxJobs: 4, rating: 4.6, bookingCount: 105, status: 'Active' },
    { name: 'Kiran Sharma', email: 'kiran.clean@email.com', phone: '9876543258', category: 'Cleaning', experience: 5, city: 'Thanjavur', isAvailable: true, currentJobs: 1, maxJobs: 4, rating: 4.5, bookingCount: 88, status: 'Active' },
    { name: 'Bhanu Prasad', email: 'bhanu.clean@email.com', phone: '9876543259', category: 'Cleaning', experience: 4, city: 'Pudukottai', isAvailable: true, currentJobs: 2, maxJobs: 4, rating: 4.3, bookingCount: 71, status: 'Active' }
];

const runSeed = async () => {
    try {
        console.log('--- Starting Auto-Seeder ---');
        await Service.deleteMany({});
        await User.deleteMany({});
        await Booking.deleteMany({});
        await Employee.deleteMany({});

        const createdServices = await Service.insertMany(initialServices);
        console.log('[1/4] Services catalog seeded');

        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'password123',
            role: 'admin'
        });

        const customerUser = await User.create({
            name: 'John Doe',
            email: 'customer@gmail.com',
            password: 'password123',
            role: 'customer'
        });
        console.log('[2/4] Admin & Customer accounts seeded');

        const createdEmployees = await Employee.insertMany(initialEmployees);
        console.log(`[3/4] ${createdEmployees.length} Employees seeded`);

        const mockBookings = [
            {
                userId: customerUser._id,
                serviceId: createdServices[0]._id,
                userName: 'John Doe',
                userPhone: '9876543210',
                location: 'Nagpur',
                userAddress: '123 Tech Street, Nagpur',
                appointmentDate: new Date(Date.now() + 86400000),
                status: 'Pending'
            },
            {
                userId: customerUser._id,
                serviceId: createdServices[3]._id,
                userName: 'Sarah Smith',
                userPhone: '5554443333',
                location: 'Mumbai',
                userAddress: '45 Lake View, Mumbai',
                appointmentDate: new Date(Date.now() - 86400000),
                status: 'Completed'
            }
        ];
        await Booking.insertMany(mockBookings);
        console.log('[4/4] Mock Bookings seeded');
        console.log('--- Auto-Seeding Complete ---');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};

module.exports = runSeed;
