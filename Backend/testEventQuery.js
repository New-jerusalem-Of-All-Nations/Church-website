require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./Models/eventsModels");

async function testQuery() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Replicate the exact query from eventRoutes.js
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let filter = {};  // Using empty filter like the API does
    
    console.log("\n🔍 Testing query with filter:", JSON.stringify(filter));
    console.log(`   skip: ${skip}, limit: ${limit}`);

    const events = await Event.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ date: -1 });

    console.log(`\n✅ Query returned ${events.length} events`);

    if (events.length > 0) {
      console.log("\nFirst event:");
      console.log(JSON.stringify(events[0], null, 2));
    } else {
      console.log("\n⚠️  No events returned!");
      
      // Try without limit/skip
      console.log("\n🔍 Trying without limit/skip...");
      const allEvents = await Event.find(filter);
      console.log(`   Found: ${allEvents.length}`);
      
      // Try with explicit empty filter
      console.log("\n🔍 Trying with explicit empty object...");
      const events2 = await Event.find({});
      console.log(`   Found: ${events2.length}`);
      
      // Try directly without filter
      console.log("\n🔍 Trying direct find()...");
      const events3 = await Event.find();
      console.log(`   Found: ${events3.length}`);
    }

    const total = await Event.countDocuments(filter);
    console.log(`\n📊 Total count with filter: ${total}`);

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testQuery();
