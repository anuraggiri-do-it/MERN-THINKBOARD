import { User } from "../model/AuthModel.js";

// Super admin only - promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow if requester is super admin (first admin in system)
    const firstAdmin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });
    if (req.user.id !== firstAdmin._id.toString()) {
      return res.status(403).json({ message: "Only super admin can promote users" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: "User promoted to admin successfully",
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};