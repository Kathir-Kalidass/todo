import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { jwtAuth } from "../middleware/jwtAuth.js";
import { getMe } from "../services/graph.service.js";
import { User } from "../models/index.js";

const router = express.Router();

const signAppJwt = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, msUserId: user.msUserId || null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

router.post("/register", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 characters" });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });

  const appJwt = signAppJwt(user);
  return res.json({ jwt: appJwt, user: { id: user.id, email: user.email, msUserId: user.msUserId } });
});

router.post("/login-local", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const appJwt = signAppJwt(user);
  return res.json({ jwt: appJwt, user: { id: user.id, email: user.email, msUserId: user.msUserId } });
});

router.post("/login", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: "accessToken is required" });
  }

  try {
    const me = await getMe(accessToken);
    const msUserId = me.data.id;
    const msEmail = me.data.mail || me.data.userPrincipalName;

    let user = await User.findOne({ where: { msUserId } });

    // If this Microsoft account isn't known yet, try linking by matching email.
    if (!user && msEmail) {
      user = await User.findOne({ where: { email: String(msEmail).trim().toLowerCase() } });
      if (user) {
        if (user.msUserId && user.msUserId !== msUserId) {
          return res.status(409).json({ message: "This app account is already linked to Microsoft" });
        }
        user.msUserId = msUserId;
      }
    }

    if (!user) {
      user = await User.create({
        msUserId,
        msEmail,
        email: String(msEmail).trim().toLowerCase()
      });
    }

    // Keep msEmail updated; keep email as a usable identifier even for MS-only accounts.
    if (user.msEmail !== msEmail) {
      user.msEmail = msEmail;
    }
    if (!user.email) {
      user.email = msEmail;
    }
    await user.save();

    const appJwt = signAppJwt(user);
    return res.json({
      jwt: appJwt,
      user: { id: user.id, email: user.email, msUserId: user.msUserId, msEmail: user.msEmail }
    });
  } catch {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/microsoft/link", jwtAuth, async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ message: "accessToken is required" });
  }

  const user = await User.findByPk(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const me = await getMe(accessToken);
    const msUserId = me.data.id;
    const msEmail = me.data.mail || me.data.userPrincipalName;

    const existingLink = await User.findOne({ where: { msUserId } });
    if (existingLink && existingLink.id !== user.id) {
      return res.status(409).json({ message: "This Microsoft account is already linked" });
    }

    user.msUserId = msUserId;
    user.msEmail = msEmail;
    await user.save();

    const appJwt = signAppJwt(user);
    return res.json({
      jwt: appJwt,
      user: { id: user.id, email: user.email, msUserId: user.msUserId, msEmail: user.msEmail }
    });
  } catch {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.get("/me", jwtAuth, async (req, res) => {
  const user = await User.findByPk(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    id: user.id,
    email: user.email,
    msUserId: user.msUserId,
    msEmail: user.msEmail
  });
});

export default router;
