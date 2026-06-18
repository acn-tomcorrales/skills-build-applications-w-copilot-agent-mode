function normalizeItems(payload) {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length };
  }

  if (!payload || typeof payload !== "object") {
    return { items: [], total: 0 };
  }

  const collections = [
    payload.items,
    payload.results,
    payload.data,
    payload.docs,
    payload.rows,
  ];

  const found = collections.find((value) => Array.isArray(value));
  const items = found ?? [];

  const total =
    payload.count ??
    payload.total ??
    payload.totalCount ??
    payload.pagination?.total ??
    items.length;

  return { items, total };
}

export function getApiEndpoint(componentName) {
  return `${getApiBaseUrl()}/${componentName}/`;
}

export function getApiBaseUrl() {
  const rawCodespace = import.meta.env.VITE_CODESPACE_NAME;
  const codespace = String(rawCodespace ?? "").trim();
  const looksValidCodespace = /^[a-z0-9][a-z0-9-]*$/i.test(codespace);
  const isPlaceholder = codespace === "your-codespace-name";

  if (codespace.length > 0 && looksValidCodespace && !isPlaceholder) {
    return `https://${codespace}-8000.app.github.dev/api`;
  }

  return "http://localhost:8000/api";
}

export async function fetchApiCollection(componentName) {
  const endpoint = getApiEndpoint(componentName);
  let response;

  try {
    response = await fetch(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch ${endpoint}: ${String(error)}`);
  }

  if (!response.ok) {
    throw new Error(
      `Request to ${endpoint} failed with status ${response.status}`,
    );
  }

  const payload = await response.json();
  const { items, total } = normalizeItems(payload);

  return {
    endpoint,
    items,
    total,
    payload,
  };
}
