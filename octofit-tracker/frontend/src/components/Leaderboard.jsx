import { useEffect, useState } from "react";
import { fetchApiEndpoint } from "../lib/api";

const codespaceName = String(import.meta.env.VITE_CODESPACE_NAME ?? "").trim();
const isConfiguredCodespace =
  codespaceName.length > 0 && codespaceName !== "your-codespace-name";
const codespaceLeaderboardEndpoint = `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;
const localLeaderboardEndpoint = "http://localhost:8000/api/leaderboard/";
const leaderboardEndpoint = isConfiguredCodespace
  ? codespaceLeaderboardEndpoint
  : localLeaderboardEndpoint;

function Leaderboard() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    items: [],
    endpoint: leaderboardEndpoint,
    total: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchApiEndpoint(leaderboardEndpoint);
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
        <h2 className="h4">Leaderboard</h2>
        <p className="text-secondary mb-3">
          Endpoint: {state.endpoint || "pending..."}
        </p>
        {state.loading && <p className="mb-0">Loading leaderboard...</p>}
        {state.error && <div className="alert alert-danger">{state.error}</div>}
        {!state.loading && !state.error && (
          <>
            <p className="fw-semibold">
              Total leaderboard records: {state.total}
            </p>
            <div className="vstack gap-3">
              {state.items.map((board) => (
                <article
                  className="border rounded p-3"
                  key={board._id ?? `${board.metric}-${board.periodLabel}`}
                >
                  <h3 className="h6 mb-1 text-capitalize">
                    {board.metric?.replaceAll("_", " ") ?? "metric"}
                  </h3>
                  <p className="mb-2 text-secondary">
                    Period: {board.periodLabel ?? "N/A"}
                  </p>
                  <ol className="mb-0 ps-3">
                    {(board.rankings ?? []).map((ranking) => (
                      <li
                        key={`${ranking.user?._id ?? ranking.rank}-${ranking.score}`}
                      >
                        {ranking.user?.username ?? "Unknown"} - score{" "}
                        {ranking.score ?? 0} (rank {ranking.rank ?? "-"})
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Leaderboard;
