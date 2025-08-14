/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { 
  Download, Upload, Plus, Trash2, Save, Wallet, PiggyBank, 
  FileJson, Calendar, Filter, Wand2, TrendingUp, TrendingDown,
  AlertCircle, DollarSign, CreditCard, Target,
  Settings, BarChart3, PieChart, Activity, Home, Menu, X
} from "lucide-react";

// ————————————————————————————————————————————
// Utilidades y constantes
// ————————————————————————————————————————————
const fmt = (n) => (isNaN(n) ? "0" : new Intl.NumberFormat("es-BO", { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
}).format(n));

const todayISO = () => new Date().toISOString().slice(0, 10);

const toMonthKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

// API simulada para demo
const api = {
  async getSettings() {
    return {
      sueldo_total_mensual: 3300,
      pago_q1: 1400,
      pago_q2: 1900,
      contar_intereses_en_total: false,
    };
  },
  
  async listarMovimientos() {
    // Datos de ejemplo
    return [
      { id: 1, fecha: "2024-08-01", tipo: "Ingreso", categoria: "Sueldo", monto: 1900, nota: "Pago Q2", extra: false, prestamo: false, interes: false },
      { id: 2, fecha: "2024-08-02", tipo: "Gasto", categoria: "Comida", monto: 35, nota: "Almuerzo", extra: false, prestamo: false, interes: false },
      { id: 3, fecha: "2024-08-03", tipo: "Gasto", categoria: "Pasajes", monto: 15, nota: "Transporte", extra: false, prestamo: false, interes: false },
      { id: 4, fecha: "2024-08-05", tipo: "Gasto", categoria: "Extra (salidas)", monto: 120, nota: "Cena con amigos", extra: true, prestamo: false, interes: false },
    ];
  },
  
  async getResumen() {
    return {
      totales: {
        ingresos_base: 1900,
        ingresos_extra: 0,
        ingresos_total: 1900,
        gastos_regulares: 50,
        gastos_extra: 120,
        prestamos: 0,
        total_gastos: 170,
        intereses_netos: 0,
        ahorro: 1730
      },
      topCategoriasGasto: [
        { categoria: "Extra (salidas)", total: 120 },
        { categoria: "Comida", total: 35 },
        { categoria: "Pasajes", total: 15 },
      ]
    };
  },
  
  async crearMovimiento(data) {
    console.log("Creando movimiento:", data);
    return { success: true };
  },
  
  async eliminarMovimiento(id) {
    console.log("Eliminando movimiento:", id);
    return { success: true };
  },
  
  async aplicarQuincena(fecha) {
    console.log("Aplicando plantilla quincenal para:", fecha);
    return { success: true };
  },
  
  async updateSettings(settings) {
    console.log("Actualizando configuración:", settings);
    return { success: true };
  }
};

const normalizeMovimiento = (m) => ({
  id: m.id,
  fecha: m.fecha,
  tipo: m.tipo,
  categoria: m.categoria,
  monto: Number(m.monto),
  nota: m.nota || "",
  extra: !!m.extra,
  prestamo: !!m.prestamo,
  interes: !!m.interes,
  mes: toMonthKey(m.fecha)
});

const CATEGORIAS_GASTO = [
  "Pasajes",
  "Comida",
  "Inhaladores", 
  "Hidrocortizonas",
  "Pasanaku semanal",
  "Pasanaku mensual",
  "Deuda",
  "Extra (salidas)",
  "Prestamo (dinero que prestas)",
  "Servicios básicos",
  "Ropa",
  "Medicinas",
  "Transporte",
  "Entretenimiento",
  "Otros gastos",
];

const CATEGORIAS_INGRESO = [
  "Sueldo",
  "Sueldo papá",
  "Pasanaku cobrado",
  "Apuestas",
  "Interés recibido",
  "Prestamo devuelto",
  "Bonificación",
  "Venta",
  "Trabajo extra",
  "Regalo/Propina",
  "Otros ingresos",
];

const CATEGORY_COLORS = {
  // Categorías de gastos
  "Pasajes": "bg-blue-500",
  "Comida": "bg-green-500",
  "Inhaladores": "bg-purple-500",
  "Hidrocortizonas": "bg-pink-500",
  "Pasanaku semanal": "bg-orange-500",
  "Pasanaku mensual": "bg-yellow-500",
  "Deuda": "bg-red-500",
  "Extra (salidas)": "bg-indigo-500",
  "Prestamo (dinero que prestas)": "bg-teal-500",
  "Servicios básicos": "bg-cyan-500",
  "Ropa": "bg-violet-500",
  "Medicinas": "bg-rose-500",
  "Transporte": "bg-sky-500",
  "Entretenimiento": "bg-amber-500",
  "Otros gastos": "bg-gray-500",
  
  // Categorías de ingresos
  "Sueldo": "bg-emerald-600",
  "Sueldo papá": "bg-green-600",
  "Pasanaku cobrado": "bg-lime-600",
  "Apuestas": "bg-yellow-600",
  "Interés recibido": "bg-emerald-500",
  "Prestamo devuelto": "bg-teal-600",
  "Bonificación": "bg-blue-600",
  "Venta": "bg-purple-600",
  "Trabajo extra": "bg-indigo-600",
  "Regalo/Propina": "bg-pink-600",
  "Otros ingresos": "bg-gray-600",
};

// ————————————————————————————————————————————
// Componentes UI
// ————————————————————————————————————————————
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-gray-100/50 ${className}`}>
      {children}
    </div>
  );
}

function Button({ variant = "primary", size = "md", children, className = "", ...props }) {
  const baseClasses = "inline-flex items-center gap-2 rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input 
        className={`rounded-2xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
}

function Select({ label, children, className = "", ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select 
        className={`rounded-2xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend, color = "blue" }) {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border-blue-200",
    green: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-900 border-emerald-200",
    red: "bg-gradient-to-br from-red-50 to-red-100 text-red-900 border-red-200",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-900 border-purple-200",
    orange: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-900 border-orange-200",
  };

  return (
    <div className={`rounded-3xl border-2 p-6 ${colorClasses[color]} transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="text-right">
            {trend > 0 ? <TrendingUp className="text-green-600" size={20} /> : <TrendingDown className="text-red-600" size={20} />}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryPill({ category, amount }) {
  const colorClass = CATEGORY_COLORS[category] || "bg-gray-500";
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium ${colorClass}`}>
      <span>{category}</span>
      <span className="font-bold">Bs {fmt(amount)}</span>
    </div>
  );
}

// ————————————————————————————————————————————
// Componente principal
// ————————————————————————————————————————————
export default function App() {
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState({
    sueldoTotalMensual: 3300,
    pagoQ1: 1400,
    pagoQ2: 1900,
    deudaInicial: 2500,
    contarInteresesEnTotal: false,
  });

  const [form, setForm] = useState({
    fecha: todayISO(),
    tipo: "Gasto",
    categoria: CATEGORIAS_GASTO[0],
    monto: "",
    nota: "",
    marcarExtra: false,
    marcarPrestamo: false,
    marcarInteres: false,
  });

  const [filter, setFilter] = useState({
    mes: toMonthKey(todayISO()),
    quincena: "Todas",
    categoria: "Todas"
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  // Categorías según tipo seleccionado
  const categoriasDisponibles = form.tipo === "Gasto" ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO;
  const todasLasCategorias = [...CATEGORIAS_GASTO, ...CATEGORIAS_INGRESO];

  // -------- API: cargar settings, movimientos y resumen --------
  const refreshAll = async () => {
    setLoading(true);
    try {
      const s = await api.getSettings();
      if (s) {
        setSettings({
          sueldoTotalMensual: Number(s.sueldo_total_mensual ?? 3300),
          pagoQ1: Number(s.pago_q1 ?? 1400),
          pagoQ2: Number(s.pago_q2 ?? 1900),
          deudaInicial: 2500,
          contarInteresesEnTotal: !!s.contar_intereses_en_total,
        });
      }
      const movs = await api.listarMovimientos({
        mes: filter.mes, quincena: filter.quincena, categoria: filter.categoria
      });
      setEntries(movs.map(normalizeMovimiento));

      const sum = await api.getResumen({
        mes: filter.mes, quincena: filter.quincena, categoria: filter.categoria, top: 5
      });
      setSummary(sum);
    } catch (e) {
      console.error(e);
      alert("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshAll(); }, []);
  useEffect(() => { refreshAll(); }, [filter.mes, filter.quincena, filter.categoria]);

  // -------- Acciones contra API --------
  const agregarMovimiento = async () => {
    const monto = parseFloat(form.monto);
    if (!form.fecha || isNaN(monto) || monto <= 0) {
      alert("Ingresa un monto válido");
      return;
    }
    try {
      await api.crearMovimiento({
        fecha: form.fecha,
        tipo: form.tipo,
        categoria: form.categoria,
        monto,
        nota: form.nota?.trim() || "",
        es_extra: form.marcarExtra,
        es_prestamo: form.marcarPrestamo,
        es_interes: form.marcarInteres,
      });
      setForm({ ...form, monto: "", nota: "" });
      await refreshAll();
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar");
    }
  };

  const cambiarTipo = (nuevoTipo) => {
    const nuevasCategorias = nuevoTipo === "Gasto" ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO;
    setForm({ ...form, tipo: nuevoTipo, categoria: nuevasCategorias[0] });
  };

  const borrar = async (id) => {
    try {
      await api.eliminarMovimiento(id);
      await refreshAll();
    } catch (e) {
      console.error(e);
      alert("No se pudo borrar");
    }
  };

  const aplicarTemplateQuincena = async (fechaReferencia) => {
    try {
      await api.aplicarQuincena(fechaReferencia);
      await refreshAll();
    } catch (e) {
      console.error(e);
      alert("No se pudo aplicar la plantilla quincenal");
    }
  };

  // -------- Derivados --------
  const mesesDisponibles = useMemo(() => {
    const set = new Set(entries.map((e) => e.mes));
    return [toMonthKey(todayISO()), ...Array.from(set)].filter((v, i, a) => a.indexOf(v) === i);
  }, [entries]);

  const filtrados = entries;

  const totales = summary?.totales || {
    ingresos_base: 0, ingresos_extra: 0, ingresos_total: 0,
    gastos_regulares: 0, gastos_extra: 0, prestamos: 0,
    total_gastos: 0, intereses_netos: 0, ahorro: 0
  };
  
  const totalesCompat = {
    ingresos: totales.ingresos_total,
    gastosRegulares: totales.gastos_regulares,
    gastosExtra: totales.gastos_extra,
    prestamos: totales.prestamos,
    totalGastos: totales.total_gastos,
    ahorro: totales.ahorro,
  };

  const analisisCategorias = summary?.topCategoriasGasto?.map(x => [x.categoria, x.total]) || [];
  const interesesAparte = totales.intereses_netos || 0;

  // -------- UI --------
  const NAV_ITEMS = [
    { id: "dashboard",   label: "Dashboard",     Icon: Home },
    { id: "movimientos", label: "Movimientos",   Icon: Activity },
    { id: "analisis",    label: "Análisis",      Icon: BarChart3 },
    { id: "configuracion", label: "Configuración", Icon: Settings },
  ];

  const Navigation = () => (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-2xl">
              <Wallet className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinanzasQ
            </h1>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={exportJSON}>
              <Download size={16} />
              Exportar
            </Button>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeTab === id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const DashboardTab = () => (
    <div className="space-y-8">
      {/* Resumen principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard
          title="Ingresos"
          value={`Bs ${fmt(totalesCompat.ingresos)}`}
          icon={<TrendingUp size={24} />}
          color="green"
        />
        <SummaryCard
          title="Gastos regulares"
          value={`Bs ${fmt(totalesCompat.gastosRegulares)}`}
          icon={<CreditCard size={24} />}
          color="blue"
        />
        <SummaryCard
          title="Gastos extra"
          value={`Bs ${fmt(totalesCompat.gastosExtra)}`}
          icon={<AlertCircle size={24} />}
          color="orange"
        />
        <SummaryCard
          title="Préstamos"
          value={`Bs ${fmt(totalesCompat.prestamos)}`}
          icon={<DollarSign size={24} />}
          color="purple"
        />
        <SummaryCard
          title="Ahorro/Saldo"
          value={`Bs ${fmt(totalesCompat.ahorro)}`}
          icon={<PiggyBank size={24} />}
          color={totalesCompat.ahorro >= 0 ? "green" : "red"}
        />
      </div>

      {/* Nuevo movimiento */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-2xl">
            <Plus className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Nuevo Movimiento</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Input
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
          <Select
            label="Tipo"
            value={form.tipo}
            onChange={(e) => cambiarTipo(e.target.value)}
          >
            <option>Gasto</option>
            <option>Ingreso</option>
          </Select>
          <Select
            label="Categoría"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            {categoriasDisponibles.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Input
            label="Monto (Bs)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
          />
          <Input
            label="Nota"
            placeholder="Detalle opcional"
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={form.marcarExtra}
              onChange={(e) => setForm({ ...form, marcarExtra: e.target.checked })}
              disabled={form.tipo === "Ingreso"}
            />
            <span className={`font-medium ${form.tipo === "Ingreso" ? "text-gray-400" : ""}`}>
              Gasto extra
            </span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={form.marcarPrestamo}
              onChange={(e) => setForm({ ...form, marcarPrestamo: e.target.checked })}
            />
            <span className="font-medium">
              {form.tipo === "Gasto" ? "Dinero prestado" : "Préstamo recibido"}
            </span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={form.marcarInteres}
              onChange={(e) => setForm({ ...form, marcarInteres: e.target.checked })}
              disabled={form.tipo === "Gasto"}
            />
            <span className={`font-medium ${form.tipo === "Gasto" ? "text-gray-400" : ""}`}>
              Interés recibido
            </span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => aplicarTemplateQuincena(todayISO())}
          >
            <Wand2 size={16} />
            Gastos fijos de esta quincena
          </Button>

          <Button variant="success" onClick={agregarMovimiento}>
            <Save size={16} />
            Guardar Movimiento
          </Button>
        </div>
      </Card>

      {/* Top categorías */}
      {analisisCategorias.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-2xl">
              <PieChart className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Top Categorías de Gastos</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {analisisCategorias.map(([categoria, amount]) => (
              <CategoryPill key={categoria} category={categoria} amount={amount} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const MovimientosTab = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-2 rounded-2xl">
            <Filter className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Mes"
            value={filter.mes}
            onChange={(e) => setFilter({ ...filter, mes: e.target.value })}
          >
            <option>Todas</option>
            {mesesDisponibles.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
          <Select
            label="Quincena"
            value={filter.quincena}
            onChange={(e) => setFilter({ ...filter, quincena: e.target.value })}
          >
            <option>Todas</option>
            <option>Q1 (1-16)</option>
            <option>Q2 (17-fin)</option>
          </Select>
          <Select
            label="Categoría"
            value={filter.categoria}
            onChange={(e) => setFilter({ ...filter, categoria: e.target.value })}
          >
            <option>Todas</option>
            {todasLasCategorias.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setFilter({ mes: toMonthKey(todayISO()), quincena: "Todas", categoria: "Todas" })}
            >
              Resetear filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de movimientos */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-2xl">
            <Calendar className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Lista de Movimientos</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left p-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-left p-4 font-semibold text-gray-700">Tipo</th>
                <th className="text-left p-4 font-semibold text-gray-700">Categoría</th>
                <th className="text-right p-4 font-semibold text-gray-700">Monto</th>
                <th className="text-left p-4 font-semibold text-gray-700">Notas</th>
                <th className="text-center p-4 font-semibold text-gray-700">Marcas</th>
                <th className="text-center p-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtrados.map((e, index) => (
                <tr key={e.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="p-4 whitespace-nowrap font-medium">{e.fecha}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      e.tipo === "Ingreso" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {e.tipo}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium text-white ${CATEGORY_COLORS[e.categoria] || "bg-gray-500"}`}>
                      {e.categoria}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-lg">Bs {fmt(e.monto)}</td>
                  <td className="p-4 max-w-[200px] truncate text-gray-600" title={e.nota}>{e.nota || "-"}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {e.extra && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">Extra</span>}
                      {e.prestamo && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">Préstamo</span>}
                      {e.interes && <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">Interés</span>}
                      {!e.extra && !e.prestamo && !e.interes && <span className="text-gray-400">-</span>}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => borrar(e.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={48} className="text-gray-300" />
                      <p className="text-lg font-medium">No hay movimientos</p>
                      <p className="text-sm">No se encontraron movimientos para los filtros actuales</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const AnalisisTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-2xl">
              <BarChart3 className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Análisis de Gastos</h2>
          </div>
          <div className="space-y-4">
            {analisisCategorias.map(([categoria, amount]) => {
              const percentage = totalesCompat.totalGastos > 0 ? (amount / totalesCompat.totalGastos) * 100 : 0;
              return (
                <div key={categoria} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{categoria}</span>
                    <span className="font-bold">Bs {fmt(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${CATEGORY_COLORS[categoria] || "bg-gray-500"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {percentage.toFixed(1)}% del total
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-2xl">
              <Target className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Resumen Financiero</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
              <span className="font-medium text-green-800">Total Ingresos</span>
              <span className="font-bold text-green-900">Bs {fmt(totalesCompat.ingresos)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl">
              <span className="font-medium text-red-800">Total Gastos</span>
              <span className="font-bold text-red-900">Bs {fmt(totalesCompat.totalGastos)}</span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-2xl ${
              totalesCompat.ahorro >= 0 ? 'bg-emerald-50' : 'bg-orange-50'
            }`}>
              <span className={`font-medium ${
                totalesCompat.ahorro >= 0 ? 'text-emerald-800' : 'text-orange-800'
              }`}>
                {totalesCompat.ahorro >= 0 ? 'Ahorro' : 'Déficit'}
              </span>
              <span className={`font-bold ${
                totalesCompat.ahorro >= 0 ? 'text-emerald-900' : 'text-orange-900'
              }`}>
                Bs {fmt(Math.abs(totalesCompat.ahorro))}
              </span>
            </div>
            {!settings.contarInteresesEnTotal && (
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl">
                <span className="font-medium text-purple-800">Intereses (aparte)</span>
                <span className="font-bold text-purple-900">
                  Bs {fmt(interesesAparte)}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const ConfiguracionTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-2xl">
            <Settings className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Configuración de Pagos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Pago 17-18 (Q2)"
            type="number"
            value={settings.pagoQ1}
            onChange={(e) => setSettings({ ...settings, pagoQ1: Number(e.target.value) })}
          />
          <Input
            label="Pago 05-06 (Q1)"
            type="number"
            value={settings.pagoQ2}
            onChange={(e) => setSettings({ ...settings, pagoQ2: Number(e.target.value) })}
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <label className="inline-flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={settings.contarInteresesEnTotal}
              onChange={(e) => setSettings({ ...settings, contarInteresesEnTotal: e.target.checked })}
            />
            <span className="font-medium">Incluir intereses recibidos dentro del total</span>
          </label>

          <Button variant="success" onClick={async () => {
            try {
              await api.updateSettings({
                pago_q1: Number(settings.pagoQ1),
                pago_q2: Number(settings.pagoQ2),
                sueldo_total_mensual: Number(settings.sueldoTotalMensual ?? 3300),
                contar_intereses_en_total: !!settings.contarInteresesEnTotal,
              });
              await refreshAll();
              alert("Configuración guardada");
            } catch (e) {
              console.error(e);
              alert("No se pudo guardar configuración");
            }
          }}>
            <Save size={16} /> Guardar Configuración
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-2 rounded-2xl">
            <FileJson className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Importar/Exportar Datos</h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={exportJSON}>
            <Download size={16} />
            Exportar JSON
          </Button>
          <label>
            <Button variant="secondary" as="span">
              <Upload size={16} />
              Importar JSON
            </Button>
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files && importJSON(e.target.files[0])}
            />
          </label>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800">Información importante</h3>
              <p className="text-sm text-yellow-700 mt-1">
                En esta versión, los datos los trae el backend. El JSON es solo para respaldo manual.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Export/Import JSON (opcional, solo respaldo local)
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ entries, settings, summary }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finanzasq_respaldo.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = JSON.parse(fr.result);
        if (Array.isArray(data.entries)) setEntries(data.entries);
        if (data.settings) setSettings({ ...settings, ...data.settings });
        if (data.summary) setSummary(data.summary);
      } catch {
        alert("Archivo inválido");
      }
    };
    fr.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="mb-6 text-sm text-gray-500">Cargando…</div>
        )}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "movimientos" && <MovimientosTab />}
        {activeTab === "analisis" && <AnalisisTab />}
        {activeTab === "configuracion" && <ConfiguracionTab />}
      </main>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>FinanzasQ - Control quincenal de ingresos y gastos</p>
              <p className="text-xs mt-1">Datos y cálculos servidos por tu API Node + MySQL</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" onClick={exportJSON}>
                <FileJson size={14} />
                Respaldar datos
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}