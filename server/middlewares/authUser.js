import jwt from "jsonwebtoken";

// Debug logging helper
const log = (label, obj) => console.log(`[AuthMiddleware] ${label}:`, JSON.stringify(obj, null, 2));

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    log("Incoming token", { token });

    if (!token) {
      log("Auth failed: No token found in cookies");
      return res.json({ success: false, message: "Not Authorized" });
    }

    let tokenDecode;
    try {
      tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      log("Token decoded successfully", tokenDecode);
    } catch (err) {
      log("Token verification failed", { error: err.message });
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    // Ensure req.body exists
    if (!req.body) req.body = {};

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
      log("User ID attached to request", { userId: req.body.userId });
      next();
    } else {
      log("Auth failed: token did not contain user ID");
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    log("Auth middleware error", { message: error.message });
    return res.json({ success: false, message: "Auth middleware error" });
  }
};

export default authUser;