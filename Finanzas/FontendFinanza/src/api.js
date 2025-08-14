const BASE = import.meta.env.VITE_API;

async function http(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// helper para querystring (sin templates anidados)
function buildQuery(params = {}) {
  const q = new URLSearchParams(
    // nota: omitimos la 1ra parte del par [key, value] con [, v]
    Object.entries(params).filter(([, v]) => v && v !== "Todas")
  ).toString();
  return q ? `?${q}` : "";
}

// Normaliza un movimiento del backend al shape que usa tu tabla
export function normalizeMovimiento(m) {
  return {
    id: m.id,
    fecha: m.fecha,
    mes: m.mes_key,
    quincena: m.quincena,
    tipo: m.tipo,
    categoria: m.categoria,
    monto: Number(m.monto),
    nota: m.nota || "",
    extra: !!m.es_extra,
    prestamo: !!m.es_prestamo,
    interes: !!m.es_interes,
    ts: m.ts,
  };
}

export const api = {
  // Movimientos
  listarMovimientos: (params = {}) => http("/movimientos" + buildQuery(params)),
  crearMovimiento: (payload) =>
    http("/movimientos", { method: "POST", body: JSON.stringify(payload) }),
  eliminarMovimiento: (id) =>
    http("/movimientos/" + id, { method: "DELETE" }),

  // Settings
  getSettings: () => http("/settings"),
  updateSettings: (payload) =>
    http("/settings", { method: "PUT", body: JSON.stringify(payload) }),

  // Templates
  aplicarQuincena: (fechaReferencia) =>
    http("/templates/quincena", {
      method: "POST",
      body: JSON.stringify({ fechaReferencia }),
    }),
  aplicarMensual: (fechaReferencia) =>
    http("/templates/mensual", {
      method: "POST",
      body: JSON.stringify({ fechaReferencia }),
    }),

  // Resumen
  getResumen: (params = {}) => http("/resumen" + buildQuery(params)),
};
