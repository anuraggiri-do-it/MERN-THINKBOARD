import jwt from "jsonwebtoken";

export const createSecretToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
