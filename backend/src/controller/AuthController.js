import { User } from "../model/AuthModel.js";
import { createSecretToken } from "../utils/secretToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Check if this email is in admin list or role is explicitly set to admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = adminEmails.includes(email) || role === "admin";

    const user = await User.create({
      username,
      email,
      password,
      role: isAdmin ? "admin" : "user",
    });

    const token = createSecretToken(user); // pass user object directly

    res.status(201).json({
      message: "User created successfully",
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = createSecretToken(user);
    console.log('Login successful for:', email);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
