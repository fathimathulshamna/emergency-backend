const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// SCHEMA
const emergencySchema = new mongoose.Schema({
    name: String,
    phone: String,
    type: String,
    priority: String,
    description: String,
    address: String,
    location: {
        latitude: String,
        longitude: String
    },
    image: String,
    status: {
        type: String,
        default: "New"
    }
}, { timestamps: true });

const Emergency = mongoose.model("Emergency", emergencySchema);

// HOME
app.get("/", (req, res) => {
    res.send("Emergency Backend Running");
});

// SAVE EMERGENCY
app.post("/api/emergency", async (req, res) => {
    try {
        const data = new Emergency(req.body);
        await data.save();

        res.json({
            status: "success",
            message: "Saved successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL
app.get("/api/emergency", async (req, res) => {
    const data = await Emergency.find().sort({ createdAt: -1 });
    res.json(data);
});

// ✅ MARK RESOLVED (IMPORTANT FIX)
app.put("/api/emergency/:id", async (req, res) => {
    try {
        const updated = await Emergency.findByIdAndUpdate(
            req.params.id,
            { status: "Resolved" },
            { new: true }
        );

        res.json({
            status: "success",
            data: updated
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// START SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});