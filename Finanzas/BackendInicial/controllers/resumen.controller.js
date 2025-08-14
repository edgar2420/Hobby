const { Movimiento, Setting } = require('../models');
const { calcTotales } = require('../utils/calc');

exports.getResumen = async (req, res) => {
  const { mes, quincena, categoria, top = 5 } = req.query;
  const where = {};
  if (mes && mes !== 'Todas') where.mes_key = mes;
  if (quincena && quincena !== 'Todas') where.quincena = quincena;
  if (categoria && categoria !== 'Todas') where.categoria = categoria;

  const movs = await Movimiento.findAll({ where });
  const settings = await Setting.findOne();

  const totales = calcTotales(movs.map(m => m.toJSON()), settings?.toJSON());

  const gastosFiltrados = movs.filter(m => m.tipo === 'Gasto' && (settings?.contar_intereses_en_total || !m.es_interes));
  const mapa = {};
  for (const g of gastosFiltrados) mapa[g.categoria] = (mapa[g.categoria] || 0) + Number(g.monto);
  const topCats = Object.entries(mapa).sort((a,b)=>b[1]-a[1]).slice(0, Number(top))
    .map(([categoria,total]) => ({ categoria, total }));

  res.json({ filtros: { mes: mes||'Todas', quincena: quincena||'Todas', categoria: categoria||'Todas' }, settings, totales, topCategoriasGasto: topCats });
};
