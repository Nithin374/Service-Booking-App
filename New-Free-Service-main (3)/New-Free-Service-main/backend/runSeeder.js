const mongoose = require('mongoose');
const runSeed = require('./seed');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/service-booking')
    .then(async () => {
        console.log("Connected to MongoDB. Running seeder...");
        await runSeed();
        console.log("Database seeded successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Failed to connect or seed:", err);
        process.exit(1);
    });
