const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.admin = verified; // Ensure `req.admin` contains user data
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Fix: Check role correctly
const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (!req.admin || !req.admin.role) {
        return res.status(403).json({ message: "Access forbidden: No role found" });
    }

    if (req.admin.role !== requiredRole) {
        return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
    }

    next();
};

module.exports = { authMiddleware, roleMiddleware };
