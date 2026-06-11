const mongoose = require('mongoose');

async function testConnection() {
    const testUris = [
        "mongodb+srv://free%20service:free@cluster0.ocuikrn.mongodb.net/service-booking?appName=Cluster0",
        "mongodb+srv://freeservice:free@cluster0.ocuikrn.mongodb.net/service-booking?appName=Cluster0",
        "mongodb+srv://free:free@cluster0.ocuikrn.mongodb.net/service-booking?appName=Cluster0",
        "mongodb+srv://free-service:free@cluster0.ocuikrn.mongodb.net/service-booking?appName=Cluster0"
    ];

    for (let uri of testUris) {
        console.log(`\nTesting URI: ${uri}`);
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
            console.log("✅ SUCCESSFUL CONNECTION!");
            console.log("=> " + uri);
            process.exit(0);
        } catch (e) {
            console.error("❌ FAILED");
        }
    }
    
    console.log("\n❌ All connection permutations failed.");
    process.exit(1);
}

testConnection();
