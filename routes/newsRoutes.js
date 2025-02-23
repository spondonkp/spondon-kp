const express = require("express");
const router = express.Router();
const News = require("../models/News");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// ✅ Allow both "admin" and "editor" to create news
router.post("/", authMiddleware, async (req, res) => {
    try {
        // ✅ Fix: Allow both "admin" and "editor" to create news
        if (!["admin", "editor"].includes(req.admin.role)) {
            return res.status(403).json({ message: "Access forbidden: You don't have permission to create news" });
        }

        const { title, content, category, imageUrl, videoUrl } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const news = new News({
            title,
            content,
            category,
            imageUrl,
            videoUrl,
            author: req.admin.username, // ✅ Save admin username as author
        });

        await news.save();
        res.status(201).json({ message: "News created successfully", news });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All News
router.get("/", async (req, res) => {
    try {
        const news = await News.find();
        res.status(200).json(news.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get News by Category
router.get("/category/:category", async (req, res) => {
    try {
        const news = await News.find({ category: req.params.category });
        res.status(200).json(news.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get Single News by ID
router.get("/:id", async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: "News not found" });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update News (Admin & Editor)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        if (!["admin", "editor"].includes(req.admin.role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete News (Only Admin)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
