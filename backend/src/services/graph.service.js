import axios from "axios";

const graph = axios.create({
  baseURL: process.env.GRAPH_BASE_URL || "https://graph.microsoft.com/v1.0"
});

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getMe = (token) => graph.get("/me", authHeaders(token));

export const getLists = (token) => graph.get("/me/todo/lists", authHeaders(token));

export const getTasks = (token, listId) =>
  graph.get(`/me/todo/lists/${listId}/tasks`, authHeaders(token));

export const createTask = (token, listId, data) =>
  graph.post(`/me/todo/lists/${listId}/tasks`, data, authHeaders(token));

export const updateTask = (token, listId, taskId, data) =>
  graph.patch(`/me/todo/lists/${listId}/tasks/${taskId}`, data, authHeaders(token));

export const deleteTask = (token, listId, taskId) =>
  graph.delete(`/me/todo/lists/${listId}/tasks/${taskId}`, authHeaders(token));
