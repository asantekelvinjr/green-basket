// src/middleware/authUser.js
import jwt from "jsonwebtoken";

// --- Debug logging helper ---
const log = (label, obj) =>
  console.log(`[AuthMiddleware] ${label}:`, JSON.stringify(obj, null, 2));

const authUser = (req, res, next) => {
  try {
    // --- Ensure cookies object exists ---
    const cookies = req.cookies || {};
    log("Incoming cookies", cookies);

    const token = cookies.token;
    if (!token) {
      log("Auth failed: No token found in cookies");
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      log("Token decoded successfully", decoded);
    } catch (err) {
      log("Token verification failed", { error: err.message });
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Ensure req.body exists
    if (!req.body) req.body = {};

    if (!decoded.id) {
      log("Auth failed: token did not contain user ID");
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    // --- Attach userId for downstream controllers ---
    req.body.userId = decoded.id;
    log("User ID attached to request", { userId: req.body.userId });

    next();
  } catch (error) {
    log("Auth middleware unexpected error", { message: error.message });
    return res.status(500).json({ success: false, message: "Auth middleware error" });
  }
};

export default authUser;