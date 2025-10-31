import jwt from "jsonwebtoken";

export const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
