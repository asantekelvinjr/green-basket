import jwt from "jsonwebtoken";

// --- Debug logging helper ---
const log = (label, obj) => console.log(`[AuthMiddleware] ${label}:`, JSON.stringify(obj, null, 2));

const authUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    log("Incoming token", { token });

    if (!token) {
      log("Auth failed: No token found in cookies");
      return res.json({ success: false, message: "Not Authorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      log("Token decoded successfully", decoded);
    } catch (err) {
      log("Token verification failed", { error: err.message });
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    if (!decoded.id) {
      log("Auth failed: token did not contain user ID");
      return res.json({ success: false, message: "Not Authorized" });
    }

    // Attach userId to request for downstream controllers
    req.userId = decoded.id;
    log("User ID attached to request", { userId: req.userId });

    next();
  } catch (error) {
    log("Auth middleware unexpected error", { message: error.message });
    return res.json({ success: false, message: "Auth middleware error" });
  }
};

export default authUser;