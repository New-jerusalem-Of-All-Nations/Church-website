const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== CORS - USING EXPRESS COR PACKAGE =====
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

console.log("✅ Environment variables loaded");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded successfully" : "❌ Not loaded!");

// ========== MOVE ROUTES UP HERE - BEFORE startServer() ==========
const eventRoutes = require("./Routes/eventRoutes");
const sermonRoutes = require("./Routes/sermonRoutes");
const getInTouchRoutes = require("./Routes/getInTouchRouter") 
const blogRoutes = require("./Routes/blogRoutes");
const paystackRoutes = require("./Routes/paystackRoutes");
const newsLetterRoutes = require("./Routes/newsLetterRouter");
const eventRegistration = require("./Routes/eventsRegistrationRouter")
const speakerRouter = require("./Routes/eventSpeakerRouter")
const heroRouter = require("./Routes/eventHeroRouter")
const authRoutes = require("./Routes/auth.routes")
console.log("📡 Auth routes loaded:", typeof authRoutes);
const adminSetupRoutes = require("./Routes/adminSetupRoutes")
const adminRoutes = require("./Routes/adminRoutes")
const memberRoutes = require("./Routes/memberRoutes")

app.use("/api/events", eventRoutes);
app.use("/api/getInTouch", getInTouchRoutes)
app.use("/api/sermons", sermonRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/paystack", paystackRoutes);
app.use("/api/newsletter", newsLetterRoutes);
app.use("/api/eventsRegistration", eventRegistration)
app.use("/api/speakers", speakerRouter)
app.use("/uploads", express.static("uploads"));  // serve uploaded images
app.use("/api/hero", heroRouter);
app.use("/api/auth", authRoutes);
app.use("/api/setup", adminSetupRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/members", memberRoutes);

// Simple test route
app.post("/api/test-endpoint", (req, res) => {
  res.json({ success: true, message: "Test endpoint works" });
});

console.log("✅ Routes registered");
// ========== END ROUTES ==========

// Basic test route
app.get("/", (req, res) => res.send("API is running..."));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Debug route to check all registered routes
app.get("/api/debug-routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  res.json({ routes: routes });
});

// Start server only after DB connects successfully
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env file");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB Atlas");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Test these endpoints:`);
      console.log(`   - http://localhost:${PORT}/api/events`);
      console.log(`   - http://localhost:${PORT}/api/sermons`);
      console.log(`   - http://localhost:${PORT}/api/blogs`);
      console.log(`   - http://localhost:${PORT}/api/newsletter`);
      console.log(`   - http://localhost:${PORT}/api/getInTouch`);
      console.log(`   - http://localhost:${PORT}/api/eventsRegistration`);
      console.log(`   - http://localhost:${PORT}/api/setup/create-admin`);
      console.log(`\n📊 DASHBOARD API ENDPOINTS:`);
      console.log(`   Members: GET/POST /api/admin/members`);
      console.log(`   Events: GET/POST /api/admin/events`);
      console.log(`   Announcements: GET/POST /api/admin/announcements`);
      console.log(`   Donations: GET/POST /api/admin/donations`);
      console.log(`   Subscriptions: GET/POST /api/admin/subscriptions`);
      console.log(`   Departments: GET/POST /api/admin/departments`);
      console.log(`   Prayer Requests: GET/POST /api/admin/prayer-requests`);
      console.log(`   Notifications: GET /api/admin/notifications`);
      console.log(`   Dashboard Stats: GET /api/admin/dashboard/stats`);
      console.log(`   - http://localhost:${PORT}/api/debug-routes`);
    });

  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
};

// Start everything
startServer();