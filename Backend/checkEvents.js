require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./Models/eventsModels");

async function checkEvents() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Count documents in Event collection
    const count = await Event.countDocuments();
    console.log(`📊 Total events in database: ${count}`);

    // Check for malformed events (missing title or date)
    const malformed = await Event.find({
      $or: [
        { title: { $exists: false } },
        { title: null },
        { title: "" },
        { date: { $exists: false } },
        { date: null }
      ]
    });

    if (malformed.length > 0) {
      console.log(`\n⚠️  Found ${malformed.length} malformed events (missing title or date):`);
      malformed.forEach(event => {
        console.log(`   - ID: ${event._id}, Title: "${event.title}", Date: "${event.date}"`);
      });

      console.log("\n🔧 Removing malformed events...");
      const result = await Event.deleteMany({
        $or: [
          { title: { $exists: false } },
          { title: null },
          { title: "" },
          { date: { $exists: false } },
          { date: null }
        ]
      });
      console.log(`✅ Removed ${result.deletedCount} malformed events`);
    }

    // Get valid events
    const validEvents = await Event.find();
    console.log(`\n📊 Valid events remaining: ${validEvents.length}`);

    if (validEvents.length > 0) {
      console.log("\n📋 Valid events:");
      validEvents.forEach((event, index) => {
        console.log(`\n${index + 1}. ${event.title}`);
        console.log(`   Date: ${event.date}`);
        console.log(`   Location: ${event.location}`);
        console.log(`   Description: ${event.description}`);
        console.log(`   ID: ${event._id}`);
      });
    }

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkEvents();
