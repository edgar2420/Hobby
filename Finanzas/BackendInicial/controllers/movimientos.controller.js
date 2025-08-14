// controllers/movimientos.controller.js
const { v4: uuid } = require('uuid');
const { Movimiento } = require('../models');
const { toMonthKey, getQuincenaLabel } = require('../utils/helpers');

exports.listar = async (req, res) => {
  const { mes, quincena, categoria } = req.query;
  const where = {};
  if (mes && mes !== 'Todas') where.mes_key = mes;
  if (quincena && quincena !== 'Todas') where.quincena = quincena;
  if (categoria && categoria !== 'Todas') where.categoria = categoria;

  const rows = await Movimiento.findAll({ where, order: [['fecha','DESC'], ['ts','DESC']] });
  res.json(rows);
};

exports.crear = async (req, res) => {
  const { fecha, tipo, categoria, monto, nota, es_extra, es_prestamo, es_interes } = req.body;
  if (!fecha || !tipo || !categoria || !monto) return res.status(400).json({ error: 'faltan campos' });

  const data = await Movimiento.create({
    id: uuid(),
    fecha,
    mes_key: toMonthKey(fecha),
    quincena: getQuincenaLabel(fecha),
    tipo, categoria, monto, nota: nota || null,
    es_extra: !!es_extra, es_prestamo: !!es_prestamo, es_interes: !!es_interes,
    ts: Date.now(),
  });
  res.status(201).json(data);
};

exports.eliminar = async (req, res) => {
  await Movimiento.destroy({ where: { id: req.params.id } });
  res.json({ ok: true });
};
