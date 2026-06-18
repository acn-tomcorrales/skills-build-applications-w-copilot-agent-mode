import { useEffect, useState } from "react";
import { fetchApiCollection, getApiEndpoint } from "../lib/api";

function Teams() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    items: [],
    endpoint: getApiEndpoint("teams"),
    total: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchApiCollection("teams");
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
        <h2 className="h4">Teams</h2>
        <p className="text-secondary mb-3">
          Endpoint: {state.endpoint || "pending..."}
        </p>
        {state.loading && <p className="mb-0">Loading teams...</p>}
        {state.error && <div className="alert alert-danger">{state.error}</div>}
        {!state.loading && !state.error && (
          <>
            <p className="fw-semibold">Total teams: {state.total}</p>
            <div className="row g-3">
              {state.items.map((team) => (
                <div className="col-12 col-lg-6" key={team._id ?? team.name}>
                  <article className="border rounded p-3 h-100">
                    <h3 className="h5 mb-1">{team.name ?? "Unnamed team"}</h3>
                    <p className="mb-2 text-secondary">
                      {team.city ?? "Unknown city"}
                    </p>
                    <p className="mb-2 fst-italic">
                      {team.motto ?? "No motto"}
                    </p>
                    <p className="mb-0">
                      Members:{" "}
                      {Array.isArray(team.members) ? team.members.length : 0}
                    </p>
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

export default Teams;
