require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const newsRoutes = require("./routes/newsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Hello From Spondon Server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
