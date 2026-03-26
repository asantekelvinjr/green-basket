import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper: log object safely
const log = (label, obj) =>
  console.log(`[UserController] ${label}:`, JSON.stringify(obj, null, 2));

// --- Register User ---
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    log("Register attempt", { name, email });

    if (!name || !email || !password) {
      log("Register failed: Missing details", req.body);
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });
    log("Existing user check", { existingUser });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    log("User created", { id: user._id, email: user.email });

    // --- JWT Token ---
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    log("Token generated", { token });

    // --- Cookie Options ---
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // must be HTTPS in prod
      sameSite: isProduction ? "none" : "lax", // none for cross-site in prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.log("[UserController] Register Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// --- Login User ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    log("Login attempt", { email });

    if (!email || !password) {
      log("Login failed: Missing email or password");
      return res.json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    log("User fetched from DB", { userId: user?._id });

    if (!user) {
      log("Login failed: User not found");
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      log("Login failed: Password mismatch");
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    log("Token generated for login", { token });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.log("[UserController] Login Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// --- Check Auth ---
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    log("Check auth", { userId });

    if (!userId) {
      log("Auth failed: No userId in request");
      return res.json({ success: false, message: "Not Authorized" });
    }

    const user = await User.findById(userId).select("-password");
    log("User fetched for auth check", { user });

    return res.json({ success: true, user });
  } catch (error) {
    console.log("[UserController] isAuth Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// --- Logout User ---
export const logout = async (req, res) => {
  try {
    log("Logout attempt");

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log("[UserController] Logout Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};