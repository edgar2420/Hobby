// utils/calc.js
function calcTotales(movimientos, settings) {
  let ingresos_base=0, ingresos_extra=0, gastos_regulares=0, gastos_extra=0, prestamos=0, intereses_netos=0;

  for (const m of movimientos) {
    const monto = Number(m.monto);
    if (m.tipo === 'Ingreso') {
      if (m.categoria === 'Sueldo') ingresos_base += monto; else ingresos_extra += monto;
      if (m.es_interes) intereses_netos += monto;
    } else {
      if (m.es_extra) gastos_extra += monto;
      else if (m.es_prestamo) prestamos += monto;
      else if (m.es_interes) {
        intereses_netos -= monto;
        if (settings?.contar_intereses_en_total) gastos_regulares += monto;
      } else {
        gastos_regulares += monto;
      }
    }
  }
  const total_gastos = gastos_regulares + gastos_extra + prestamos;
  const ingresos_total = ingresos_base + ingresos_extra;
  const ahorro = ingresos_total - total_gastos;

  return { ingresos_base, ingresos_extra, ingresos_total, gastos_regulares, gastos_extra, prestamos, total_gastos, intereses_netos, ahorro };
}
module.exports = { calcTotales };
