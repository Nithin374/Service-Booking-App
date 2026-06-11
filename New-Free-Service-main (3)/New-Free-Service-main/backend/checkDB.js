require('dotenv').config();
const mongoose = require('mongoose');

// Define models briefly for querying
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

const bookingSchema = new mongoose.Schema({}, { strict: false });
const Booking = mongoose.model('Booking', bookingSchema, 'bookings');

async function checkDatabaseData() {
    try {
        console.log("🔌 Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/service-booking');
        console.log("✅ Successfully connected to MongoDB Database: service-booking\n");
        
        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        
        console.log("📊 --- DATABASE TOTALS ---");
        console.log(`Total Registered Users: ${userCount}`);
        console.log(`Total Bookings: ${bookingCount}\n`);
        
        console.log("👤 --- RECENT USERS SAVED IN DATABASE ---");
        const recentUsers = await User.find().sort({ _id: -1 }).limit(3);
        
        if (recentUsers.length === 0) {
            console.log("No users found in database yet!");
        } else {
            recentUsers.forEach(user => {
                console.log(`-> Email: ${user.email} | Role: ${user.role} | Name: ${user.name}`);
            });
        }
        
    } catch(err) {
        console.error("❌ Connection Failed:", err);
    } finally {
        console.log("\nClosing connection...");
        mongoose.connection.close();
    }
}

checkDatabaseData();
