import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api.js";

export default function Tasks() {
  const { listId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aDone = a.status === "completed";
      const bDone = b.status === "completed";
      if (aDone !== bDone) return aDone ? 1 : -1;
      return (a.title || "").localeCompare(b.title || "");
    });
  }, [tasks]);

  const load = async () => {
    setError("");
    try {
      const res = await api.get(`/todo/tasks/${listId}`);
      setTasks(res.data.value || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load tasks");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;

    try {
      await api.post(`/todo/tasks/${listId}`, { title: title.trim() });
      setTitle("");
      await load();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to create task");
    }
  };

  const toggleComplete = async (task) => {
    setError("");
    const newStatus = task.status === "completed" ? "notStarted" : "completed";

    try {
      await api.patch(`/todo/tasks/${listId}/${task.id}`, { status: newStatus });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update task");
    }
  };

  const remove = async (task) => {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    setError("");
    try {
      await api.delete(`/todo/tasks/${listId}/${task.id}`);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div className="page-shell">
      <div className="aurora-blur" aria-hidden />
      <div className="aurora-blur-2" aria-hidden />

      <div className="relative w-full max-w-6xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="pill">Task list</p>
            <h1 className="mt-3 text-3xl font-semibold">Tasks</h1>
            <p className="small-label">Create, complete, and celebrate progress.</p>
          </div>
          <Link className="btn-ghost" to="/dashboard">
            Back to lists
          </Link>
        </div>

        {error ? (
          <div className="glass-card p-4 text-sm text-red-100">{error}</div>
        ) : null}

        <div className="glass-card p-6 space-y-4">
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={create}>
            <input
              className="tile-card text-base text-white placeholder:text-slate-200/60"
              placeholder="New task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="btn-primary">Add task</button>
          </form>

          <div className="divider" />

          {sortedTasks.length === 0 ? (
            <div className="tile-card text-sm text-slate-200/85">No tasks found.</div>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((t) => (
                <div key={t.id} className="tile-card fade-up flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-lg font-semibold">{t.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-200/80">
                      <span className={`task-chip ${t.status === "completed" ? "status-complete" : ""}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button className="btn-ghost" onClick={() => toggleComplete(t)}>
                      {t.status === "completed" ? "Mark incomplete" : "Mark complete"}
                    </button>
                    <button className="btn-ghost" onClick={() => remove(t)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
