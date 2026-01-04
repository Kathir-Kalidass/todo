import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load profile");
      }
    })();
  }, []);

  return (
    <div className="page-shell">
      <div className="aurora-blur" aria-hidden />
      <div className="aurora-blur-2" aria-hidden />

      <div className="relative w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="pill">Your account</p>
            <h1 className="mt-2 text-3xl font-semibold">Profile</h1>
            <p className="small-label">Microsoft identity data in one glance.</p>
          </div>
          <Link className="btn-ghost" to="/dashboard">
            Back to dashboard
          </Link>
        </div>

        {error ? (
          <div className="glass-card p-4 text-sm text-red-100">{error}</div>
        ) : null}

        <div className="glass-card p-6">
          {!profile ? (
            <div className="text-sm text-slate-200/80">Loading...</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="tile-card">
                <p className="small-label">App Email</p>
                <p className="text-lg font-semibold">{profile.email}</p>
              </div>
              <div className="tile-card">
                <p className="small-label">Microsoft User ID</p>
                <p className="text-lg font-semibold">{profile.msUserId || "Not linked"}</p>
              </div>

              <div className="tile-card sm:col-span-2">
                <p className="small-label">Microsoft Email</p>
                <p className="text-lg font-semibold">{profile.msEmail || "Not linked"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
