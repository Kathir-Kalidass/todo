import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/todo/lists");
        setLists(res.data.value || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load lists");
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("msAccessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="page-shell">
      <div className="aurora-blur" aria-hidden />
      <div className="aurora-blur-2" aria-hidden />

      <div className="relative w-full max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold">Your Microsoft To Do lists</h1>
            <p className="small-label">Synced live with your Microsoft account.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-ghost" to="/profile">
              Profile
            </Link>
            <button className="btn-primary" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {error ? (
          <div className="glass-card p-4 text-sm text-red-100">{error}</div>
        ) : null}

        <div className="glass-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="small-label">Lists</p>
              <p className="text-lg font-semibold">Pick a list to dive into its tasks.</p>
            </div>
            <div className="task-chip">Live</div>
          </div>

          <div className="divider my-4" />

          {lists.length === 0 ? (
            <div className="tile-card text-sm text-slate-200/85">No lists found.</div>
          ) : (
            <div className="tile-grid">
              {lists.map((l) => (
                <Link key={l.id} className="tile-card" to={`/tasks/${l.id}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{l.displayName}</p>
                      <p className="small-label">Tap to open tasks</p>
                    </div>
                    <span className="task-chip">Open</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
