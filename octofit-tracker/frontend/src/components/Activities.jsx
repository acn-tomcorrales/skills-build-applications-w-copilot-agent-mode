import { useEffect, useState } from "react";
import { fetchApiCollection, getApiEndpoint } from "../lib/api";

function Activities() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    items: [],
    endpoint: getApiEndpoint("activities"),
    total: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchApiCollection("activities");
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
        <h2 className="h4">Activities</h2>
        <p className="text-secondary mb-3">
          Endpoint: {state.endpoint || "pending..."}
        </p>
        {state.loading && <p className="mb-0">Loading activities...</p>}
        {state.error && <div className="alert alert-danger">{state.error}</div>}
        {!state.loading && !state.error && (
          <>
            <p className="fw-semibold">Total activities: {state.total}</p>
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Calories</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((activity) => (
                    <tr
                      key={
                        activity._id ??
                        `${activity.type}-${activity.performedAt}`
                      }
                    >
                      <td>{activity.user?.username ?? "-"}</td>
                      <td className="text-capitalize">
                        {activity.type ?? "-"}
                      </td>
                      <td>{activity.durationMin ?? 0} min</td>
                      <td>{activity.caloriesBurned ?? 0}</td>
                      <td>
                        {activity.performedAt
                          ? new Date(activity.performedAt).toLocaleString()
                          : "-"}
                      </td>
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

export default Activities;
