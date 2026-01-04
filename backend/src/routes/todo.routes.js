import express from "express";

import { jwtAuth } from "../middleware/jwtAuth.js";
import { ActivityLog } from "../models/index.js";
import { getMsAccessToken } from "../utils/getMsAccessToken.js";
import * as graph from "../services/graph.service.js";

const router = express.Router();

router.get("/lists", jwtAuth, async (req, res) => {
  const msAccessToken = getMsAccessToken(req);
  if (!msAccessToken) {
    return res.status(400).json({ message: "Missing Microsoft access token (x-ms-access-token)" });
  }

  const data = await graph.getLists(msAccessToken);
  return res.json(data.data);
});

router.get("/tasks/:listId", jwtAuth, async (req, res) => {
  const msAccessToken = getMsAccessToken(req);
  if (!msAccessToken) {
    return res.status(400).json({ message: "Missing Microsoft access token (x-ms-access-token)" });
  }

  const data = await graph.getTasks(msAccessToken, req.params.listId);
  return res.json(data.data);
});

router.post("/tasks/:listId", jwtAuth, async (req, res) => {
  const msAccessToken = getMsAccessToken(req);
  if (!msAccessToken) {
    return res.status(400).json({ message: "Missing Microsoft access token (x-ms-access-token)" });
  }

  const data = await graph.createTask(msAccessToken, req.params.listId, req.body);

  await ActivityLog.create({
    userId: String(req.user.userId),
    action: "CREATE",
    taskTitle: data.data?.title,
    listId: req.params.listId,
    taskId: data.data?.id
  });

  return res.json(data.data);
});

router.patch("/tasks/:listId/:taskId", jwtAuth, async (req, res) => {
  const msAccessToken = getMsAccessToken(req);
  if (!msAccessToken) {
    return res.status(400).json({ message: "Missing Microsoft access token (x-ms-access-token)" });
  }

  const data = await graph.updateTask(
    msAccessToken,
    req.params.listId,
    req.params.taskId,
    req.body
  );

  await ActivityLog.create({
    userId: String(req.user.userId),
    action: "UPDATE",
    taskTitle: req.body?.title,
    listId: req.params.listId,
    taskId: req.params.taskId
  });

  return res.json(data.data);
});

router.delete("/tasks/:listId/:taskId", jwtAuth, async (req, res) => {
  const msAccessToken = getMsAccessToken(req);
  if (!msAccessToken) {
    return res.status(400).json({ message: "Missing Microsoft access token (x-ms-access-token)" });
  }

  await graph.deleteTask(msAccessToken, req.params.listId, req.params.taskId);

  await ActivityLog.create({
    userId: String(req.user.userId),
    action: "DELETE",
    listId: req.params.listId,
    taskId: req.params.taskId
  });

  return res.status(204).send();
});

export default router;
