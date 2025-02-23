const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Admin Registration
router.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!["admin", "editor"].includes(role)) return res.status(400).json({ message: "Invalid role" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword, role });
        await admin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Admins
router.get("/", async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get Single Admin by ID
router.get("/:id", async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Admin
router.put("/:id", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const reqBody = { ...req.body, password: hashedPassword };
        const admin = await Admin.findByIdAndUpdate(req.params.id, reqBody, { new: true });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Admin
router.delete("/:id", async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
