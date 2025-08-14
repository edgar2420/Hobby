const { v4: uuid } = require('uuid');
const { Movimiento, PlantillaQuincena, Setting, Suscripcion, Servicio } = require('../models');
const { toMonthKey, getQuincenaLabel } = require('../utils/helpers');

exports.aplicarQuincena = async (req, res) => {
  const { fechaReferencia } = req.body;
  const mes_key = toMonthKey(fechaReferencia);
  const quincena = getQuincenaLabel(fechaReferencia);
  const ts = Date.now();

  const plant = await PlantillaQuincena.findAll({ where: { quincena } });
  if (!plant.length) return res.status(400).json({ error: 'Sin plantilla_quincena' });

  const bulk = plant.map(p => ({
    id: uuid(), fecha: fechaReferencia, mes_key, quincena,
    tipo: p.tipo, categoria: p.categoria, monto: p.monto, nota: p.nota,
    es_extra: p.es_extra, es_prestamo: p.es_prestamo, es_interes: p.es_interes, ts,
  }));
  await Movimiento.bulkCreate(bulk);

  const s = await Setting.findOne();
  if (s) {
    const sueldoMonto = quincena === 'Q1 (1-16)' ? Number(s.pago_q1) : Number(s.pago_q2);
    if (sueldoMonto > 0) {
      await Movimiento.create({
        id: uuid(), fecha: fechaReferencia, mes_key, quincena,
        tipo: 'Ingreso', categoria: 'Sueldo', monto: sueldoMonto, nota: 'Pago sueldo',
        es_extra: false, es_prestamo: false, es_interes: false, ts,
      });
    }
  }

  const inserted = await Movimiento.findAll({ where: { ts, fecha: fechaReferencia } });
  res.json(inserted);
};

exports.aplicarMensual = async (req, res) => {
  const { fechaReferencia } = req.body;
  const mes_key = toMonthKey(fechaReferencia);
  const quincena = getQuincenaLabel(fechaReferencia);
  const ts = Date.now();

  const sus = await Suscripcion.findAll();
  const srv = await Servicio.findAll();

  const rows = [
    ...sus.map(s => ({
      id: uuid(), fecha: fechaReferencia, mes_key, quincena,
      tipo: 'Gasto', categoria: s.categoria, monto: s.monto, nota: s.nota || 'Suscripción mensual',
      es_extra: false, es_prestamo: false, es_interes: false, ts,
    })),
    ...srv.map(s => ({
      id: uuid(), fecha: fechaReferencia, mes_key, quincena,
      tipo: 'Gasto', categoria: s.categoria, monto: s.monto, nota: s.nota || 'Servicio mensual',
      es_extra: false, es_prestamo: false, es_interes: false, ts,
    })),
  ];
  if (!rows.length) return res.status(400).json({ error: 'Sin suscripciones/servicios' });

  await Movimiento.bulkCreate(rows);
  const inserted = await Movimiento.findAll({ where: { ts, fecha: fechaReferencia } });
  res.json(inserted);
};
