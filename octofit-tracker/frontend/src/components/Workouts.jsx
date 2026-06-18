import { useEffect, useState } from "react";
import { fetchApiEndpoint } from "../lib/api";

const codespaceName = String(import.meta.env.VITE_CODESPACE_NAME ?? "").trim();
const isConfiguredCodespace =
  codespaceName.length > 0 && codespaceName !== "your-codespace-name";
const codespaceWorkoutsEndpoint = `https://${codespaceName}-8000.app.github.dev/api/workouts/`;
const localWorkoutsEndpoint = "http://localhost:8000/api/workouts/";
const workoutsEndpoint = isConfiguredCodespace
  ? codespaceWorkoutsEndpoint
  : localWorkoutsEndpoint;

function Workouts() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    items: [],
    endpoint: workoutsEndpoint,
    total: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchApiEndpoint(workoutsEndpoint);
        if (mounted) {
          setState({ loading: false, error: "", ...result });
        }
      } catch (error) {
        if (mounted) {
          setState((previous) => ({
            ...previous,
            loading: false,
            error: String(error),
          }));
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Workouts</h2>
        <p className="text-secondary mb-3">
          Endpoint: {state.endpoint || "pending..."}
        </p>
        {state.loading && <p className="mb-0">Loading workouts...</p>}
        {state.error && <div className="alert alert-danger">{state.error}</div>}
        {!state.loading && !state.error && (
          <>
            <p className="fw-semibold">Total workouts: {state.total}</p>
            <div className="row g-3">
              {state.items.map((workout) => (
                <div
                  className="col-12 col-lg-6"
                  key={workout._id ?? workout.title}
                >
                  <article className="border rounded p-3 h-100">
                    <h3 className="h5 mb-1">
                      {workout.title ?? "Untitled workout"}
                    </h3>
                    <p className="mb-2 text-capitalize text-secondary">
                      {workout.focus ?? "focus"} |{" "}
                      {workout.difficulty ?? "difficulty"}
                    </p>
                    <p className="mb-2">
                      Duration: {workout.durationMin ?? 0} minutes
                    </p>
                    <p className="mb-1 fw-semibold">Equipment</p>
                    <p className="mb-2">
                      {Array.isArray(workout.equipment) &&
                      workout.equipment.length > 0
                        ? workout.equipment.join(", ")
                        : "No equipment listed"}
                    </p>
                    <p className="mb-1 fw-semibold">Steps</p>
                    <ol className="mb-0 ps-3">
                      {(workout.steps ?? []).map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </article>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Workouts;
