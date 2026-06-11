const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const Service = require('./models/Service');

const app = express();
const PORT = process.env.PORT || 5000;
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/free-service';
let dbSource = 'disconnected';

const defaultServices = [
    {
        title: 'Air Conditioner',
        description: 'Expert AC repair, servicing, and installation at your doorstep.',
        category: 'Air Conditioner',
        price: 999,
        imageIcon: 'AC'
    },
    {
        title: 'Beauty Salon at Home',
        description: 'Professional beauty services including waxing, facials, and manicure.',
        category: 'Beauty Salon',
        price: 1499,
        imageIcon: 'BEAUTY'
    },
    {
        title: 'Refrigerator',
        description: 'Fix cooling issues, gas leaks, and door seals for all major brands.',
        category: 'Refrigerator',
        price: 1200,
        imageIcon: 'FRIDGE'
    },
    {
        title: 'Plumber',
        description: 'Fast and reliable plumbing services for leaks and installations.',
        category: 'Plumbing',
        price: 499,
        imageIcon: 'PLUMB'
    },
    {
        title: 'Electrician',
        description: 'Expert electrical services from wiring to appliance repair.',
        category: 'Electrical',
        price: 399,
        imageIcon: 'ELEC'
    },
    {
        title: 'Geyser',
        description: 'Electric and Gas geyser heating issues, power issues, and installation.',
        category: 'Geyser',
        price: 699,
        imageIcon: 'GEYSER'
    },
    {
        title: 'Home Cleaning',
        description: 'Deep cleaning for the kitchen, bathroom, sofa, and full home.',
        category: 'Cleaning',
        price: 2499,
        imageIcon: 'CLEAN'
    },
    {
        title: 'Washing Machine',
        description: 'Repair and servicing for top-load and front-load washing machines.',
        category: 'Washing Machine',
        price: 899,
        imageIcon: 'WM'
    },
    {
        title: 'Water Purifier',
        description: 'RO repair, filter change, and installation services.',
        category: 'Water Purifier',
        price: 599,
        imageIcon: 'WATER'
    }
];

// Health endpoint for local/dev monitoring
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// DB info endpoint for checking Atlas vs local runtime connection
app.get('/api/db-info', (_req, res) => {
    const db = mongoose.connection;
    const host = db?.host || null;
    const name = db?.name || null;
    const isConnected = db?.readyState === 1;
    const isAtlas = typeof host === 'string' && host.includes('mongodb.net');

    res.json({
        connected: isConnected,
        host,
        dbName: name,
        isAtlas,
        source: dbSource
    });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes')); // Added application routes
app.use('/api/employees', require('./routes/employeeRoutes')); // Employee management

const connectMongo = async (uri) => {
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
    });
};

const connectInMemory = async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectMongo(uri);
    dbSource = 'in-memory';
    console.log('Started local In-Memory MongoDB automatically!');

    const runSeed = require('./seed');
    await runSeed();
};

const ensureDemoUsers = async () => {
    if (process.env.NODE_ENV === 'production') return;

    const User = require('./models/User');

    const syncDemoUser = async ({ name, email, role }) => {
        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            await User.create({
                name,
                email: normalizedEmail,
                password: 'password123',
                role
            });
            return;
        }

        user.name = name;
        user.role = role;
        user.password = 'password123';
        await user.save();
    };

    await syncDemoUser({ name: 'Admin', email: 'admin@gmail.com', role: 'admin' });
    await syncDemoUser({ name: 'John Doe', email: 'customer@gmail.com', role: 'customer' });
};

const ensureServicesSeeded = async () => {
    const allServices = await Service.find().sort({ createdAt: 1, _id: 1 }).select('_id title');
    const seenTitles = new Set();
    const duplicateIds = [];

    for (const svc of allServices) {
        if (seenTitles.has(svc.title)) {
            duplicateIds.push(svc._id);
        } else {
            seenTitles.add(svc.title);
        }
    }

    if (duplicateIds.length > 0) {
        await Service.deleteMany({ _id: { $in: duplicateIds } });
        console.log(`Removed duplicate services: ${duplicateIds.length}`);
    }

    for (const service of defaultServices) {
        await Service.updateOne(
            { title: service.title },
            { $setOnInsert: service },
            { upsert: true }
        );
    }

    const total = await Service.countDocuments();
    console.log(`Service catalog ready. Total services: ${total}`);
};

// Database Connection
const startServer = async () => {
    const primaryUri = process.env.MONGODB_URI || LOCAL_MONGO_URI;
    const isAtlasPrimary = primaryUri.includes('mongodb.net') || primaryUri.startsWith('mongodb+srv://');

    try {
        await connectMongo(primaryUri);
        dbSource = isAtlasPrimary ? 'atlas' : 'local';
        console.log(`Connected to MongoDB successfully! Source: ${dbSource}`);
    } catch (primaryErr) {
        console.error('Primary MongoDB connection failed:', primaryErr.message);

        if (isAtlasPrimary) {
            try {
                await connectMongo(LOCAL_MONGO_URI);
                dbSource = 'local';
                console.log('Connected to local MongoDB fallback (Compass/local service).');
            } catch (localErr) {
                console.error('Local MongoDB fallback failed:', localErr.message);
                await connectInMemory();
            }
        } else {
            await connectInMemory();
        }
    }

    await ensureServicesSeeded();
    await ensureDemoUsers();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
