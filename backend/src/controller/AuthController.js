import { User } from "../model/AuthModel.js";
import { createSecretToken } from "../utils/secretToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });
    const token = createSecretToken(user._id);

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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = createSecretToken(user._id);
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
