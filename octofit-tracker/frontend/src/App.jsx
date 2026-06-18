import { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Activities from "./components/Activities.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Teams from "./components/Teams.jsx";
import Users from "./components/Users.jsx";
import Workouts from "./components/Workouts.jsx";
import { getApiBaseUrl } from "./lib/api";
import "./App.css";

const navItems = [
  { path: "/users", label: "Users" },
  { path: "/teams", label: "Teams" },
  { path: "/activities", label: "Activities" },
  { path: "/leaderboard", label: "Leaderboard" },
  { path: "/workouts", label: "Workouts" },
];

function App() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const healthEndpoint = `${apiBaseUrl}/health`;
  const [healthState, setHealthState] = useState({
    loading: true,
    ok: false,
    message: "Checking API...",
  });

  useEffect(() => {
    let mounted = true;

    async function checkHealth() {
      try {
        const response = await fetch(healthEndpoint);

        if (!response.ok) {
          throw new Error(`Health check failed with status ${response.status}`);
        }

        if (mounted) {
          setHealthState({
            loading: false,
            ok: true,
            message: "API reachable",
          });
        }
      } catch (error) {
        if (mounted) {
          setHealthState({ loading: false, ok: false, message: String(error) });
        }
      }
    }

    void checkHealth();

    return () => {
      mounted = false;
    };
  }, [healthEndpoint]);

  return (
    <div className="app-shell bg-light min-vh-100">
      <header className="border-bottom bg-white sticky-top">
        <div className="container py-3">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div>
              <h1 className="h3 mb-1">Octofit Tracker</h1>
              <p className="mb-0 text-secondary">
                React 19 presentation tier with Codespaces-aware API routing
              </p>
            </div>
            <nav className="d-flex flex-wrap gap-2" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `btn btn-sm ${isActive ? "btn-dark" : "btn-outline-dark"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <section
          className={`alert ${healthState.ok ? "alert-success" : "alert-warning"}`}
          role="status"
        >
          <div className="fw-semibold">API Base URL: {apiBaseUrl}</div>
          <div>Health endpoint: {healthEndpoint}</div>
          <div>
            {healthState.loading
              ? "Checking API health..."
              : healthState.message}
          </div>
        </section>

        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
