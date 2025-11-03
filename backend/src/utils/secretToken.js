import jwt from "jsonwebtoken";

export const createSecretToken = (payload) => {
  // Handle both user object and payload object
  const tokenPayload = payload._id ? 
    { id: payload._id, role: payload.role } : 
    payload;
    
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
