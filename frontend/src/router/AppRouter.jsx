import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Tasks from "../pages/Tasks.jsx";
import Profile from "../pages/Profile.jsx";

function RequireAuth({ children }) {
  const jwt = localStorage.getItem("jwt");
  const msAccessToken = localStorage.getItem("msAccessToken");
  if (!jwt || !msAccessToken) return <Navigate to="/login" replace />;
  return children;
}

function RedirectIfAuthed({ children }) {
  const jwt = localStorage.getItem("jwt");
  const msAccessToken = localStorage.getItem("msAccessToken");
  if (jwt && msAccessToken) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthed>
              <Navigate to="/login" replace />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/tasks/:listId"
          element={
            <RequireAuth>
              <Tasks />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
