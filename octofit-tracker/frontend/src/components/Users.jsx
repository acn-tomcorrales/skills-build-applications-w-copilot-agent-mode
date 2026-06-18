import { useEffect, useState } from "react";
import { fetchApiCollection, getApiEndpoint } from "../lib/api";

function Users() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    items: [],
    endpoint: getApiEndpoint("users"),
    total: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchApiCollection("users");
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
        <h2 className="h4">Users</h2>
        <p className="text-secondary mb-3">
          Endpoint: {state.endpoint || "pending..."}
        </p>
        {state.loading && <p className="mb-0">Loading users...</p>}
        {state.error && <div className="alert alert-danger">{state.error}</div>}
        {!state.loading && !state.error && (
          <>
            <p className="fw-semibold">Total users: {state.total}</p>
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Fitness Level</th>
                    <th>Team</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((user) => (
                    <tr key={user._id ?? user.email}>
                      <td>{user.username ?? "-"}</td>
                      <td>{user.email ?? "-"}</td>
                      <td className="text-capitalize">
                        {user.fitnessLevel ?? "-"}
                      </td>
                      <td>{user.team?.name ?? "Unassigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Users;
