import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const log = (label, obj) => console.log(`[UserController] ${label}:`, JSON.stringify(obj, null, 2));

// --- Register User ---
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ success: false, message: "Missing Details" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, user: { email: user.email, name: user.name, cartItems: user.cartItems } });
  } catch (error) {
    console.error("[UserController] Register Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// --- Login User ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, user: { email: user.email, name: user.name, cartItems: user.cartItems } });
  } catch (error) {
    console.error("[UserController] Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// --- Check Auth ---
export const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false, message: "Not Authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.json({ success: false, message: "Not Authorized" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("[UserController] isAuth Error:", error.message);
    res.json({ success: false, message: "Not Authorized" });
  }
};

// --- Logout ---
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("[UserController] Logout Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};