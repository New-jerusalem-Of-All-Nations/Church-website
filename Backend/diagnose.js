require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./Models/eventsModels");

async function diagnose() {
  try {
    console.log("=== DIAGNOSTIC TEST ===\n");

    console.log("Step 1: Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected\n");

    console.log("Step 2: Checking Event collection...");
    const  count = await Event.countDocuments();
    const total = await Event.countDocuments({});
    console.log(`   - Total events (no filter): ${count}`);
    console.log(`   - Total events (empty filter): ${total}\n`);

    console.log("Step 3: Simulating API query...");
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const filter = {}; // Empty filter like in eventRoutes

    const events = await Event.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ date: -1 });

    console.log(`✅ Query returned ${events.length} events`);
    if (events.length > 0) {
      console.log(`   First event: ${events[0].title}\n`);
    }

    console.log("Step 4: Checking database connection status...");
    console.log(`   - Connection state: ${mongoose.connection.readyState}`);
    console.log(`   - Connected: ${mongoose.connection.readyState === 1 ? 'Yes' : 'No'}`);
    console.log(`   - DB Name: ${mongoose.connection.name}`);
    console.log(`   - Collections: ${Object.keys(mongoose.connection.collections).length}\n`);

    console.log("Step 5: Direct database inspection...");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`   - Total Collections: ${collections.length}`);
    const eventCollection = collections.find(c => c.name === 'events');
    if (eventCollection) {
      const docCount = await db.collection('events').countDocuments();
      console.log(`   - 'events' collection found with ${docCount} documents`);
    } else {
      console.log(`   - 'events' collection NOT found`);
      console.log(`   - Available collections: ${collections.map(c => c.name).join(', ')}`);
    }

    await mongoose.disconnect();
    console.log("\n✅ Diagnostic complete");
  } catch (error) {
    console.error("\n❌ Error during diagnostic:", error.message);
    process.exit(1);
  }
}

diagnose();
