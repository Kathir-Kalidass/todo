import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";

import api from "../services/api.js";

const scopes = ["User.Read", "Tasks.ReadWrite"];

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const msal = useMemo(() => {
    const tenantId = import.meta.env.VITE_MSAL_TENANT_ID || "common";
    const clientId = import.meta.env.VITE_MSAL_CLIENT_ID;

    return new PublicClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: window.location.origin
      },
      cache: {
        cacheLocation: "localStorage"
      }
    });
  }, []);

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      if (!import.meta.env.VITE_MSAL_CLIENT_ID) {
        throw new Error("Missing VITE_MSAL_CLIENT_ID in frontend env");
      }

      const loginResult = await msal.loginPopup({ scopes });
      const tokenResult = await msal.acquireTokenSilent({
        account: loginResult.account,
        scopes
      });

      const accessToken = tokenResult.accessToken;
      localStorage.setItem("msAccessToken", accessToken);

      const res = await api.post("/auth/login", { accessToken });
      localStorage.setItem("jwt", res.data.jwt);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell overflow-hidden">
      <div className="aurora-blur" aria-hidden />
      <div className="aurora-blur-2" aria-hidden />

      <div className="relative grid w-full max-w-6xl gap-10 lg:grid-cols-2">
        <div className="space-y-5 self-center fade-up">
          <span className="pill">Elevate your day</span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              A brighter way to manage your tasks with
              <span className="flow-text"> Microsoft To Do</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-200/85">
              Glide into your tasks with a colorful, animated workspace. We keep your data secure
              through Microsoft sign-in while storing only the essentials for mapping and activity
              logs.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="tile-card">
              <p className="text-base font-semibold">Live-sync</p>
              <p className="small-label">Reads and writes directly to your Microsoft To Do.</p>
            </div>
            <div className="tile-card">
              <p className="text-base font-semibold">Secure entry</p>
              <p className="small-label">Popup login; no password stored here.</p>
            </div>
          </div>
        </div>

        <div className="accent-ring fade-up">
          <div className="glass-card p-8">
            <div className="space-y-2">
              <p className="pill w-fit">Sign in</p>
              <h2 className="text-2xl font-semibold">Microsoft account</h2>
              <p className="text-sm text-slate-200/75">
                Use your Microsoft credentials to continue. Password rules are enforced by Microsoft;
                we never capture your password.
              </p>
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button className="btn-primary mt-6 w-full" onClick={login} disabled={loading}>
              <span>{loading ? "Opening Microsoft login..." : "Sign in with Microsoft"}</span>
            </button>

            <div className="divider my-6" />
            <p className="small-label">
              Tasks stay in your Microsoft account. We only keep a lightweight JWT and user mapping in
              PostgreSQL for session continuity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
