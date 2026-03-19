const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS setup
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Simplified API endpoint
app.post("/api/save", (req, res) => {
  try {
    const { name, status, description } = req.body;

    // Basic validation
    if (!name || !status || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, status, description) are required",
      });
    }

    // Optional: only allow certain statuses
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "active" or "inactive"',
      });
    }

    // Here you would save to a database
    console.log("Saved item:", { name, status, description });

    res.status(200).json({
      success: true,
      message: "Item saved successfully",
      data: { name, status, description },
    });
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
