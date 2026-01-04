import express from "express";
import jwt from "jsonwebtoken";

import { jwtAuth } from "../middleware/jwtAuth.js";
import { getMe } from "../services/graph.service.js";
import { User } from "../models/index.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: "accessToken is required" });
  }

  try {
    const me = await getMe(accessToken);
    const msUserId = me.data.id;
    const email = me.data.mail || me.data.userPrincipalName;

    const [user] = await User.findOrCreate({
      where: { msUserId },
      defaults: { msUserId, email }
    });

    if (user.email !== email) {
      user.email = email;
      await user.save();
    }

    const appJwt = jwt.sign(
      { msUserId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return res.json({ jwt: appJwt, user: { msUserId, email } });
  } catch {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.get("/me", jwtAuth, async (req, res) => {
  const { msUserId } = req.user;

  const user = await User.findOne({ where: { msUserId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ msUserId: user.msUserId, email: user.email });
});

export default router;
