const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "editor" }, // Role-based access
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);

