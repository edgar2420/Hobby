// controllers/settings.controller.js
const { Setting } = require('../models');

exports.get = async (_req, res) => {
  const s = await Setting.findOne();
  res.json(s || null);
};

exports.update = async (req, res) => {
  let s = await Setting.findOne();
  if (!s) s = await Setting.create({});
  const { sueldo_total_mensual, pago_q1, pago_q2, contar_intereses_en_total } = req.body;
  await s.update({
    sueldo_total_mensual: sueldo_total_mensual ?? s.sueldo_total_mensual,
    pago_q1: pago_q1 ?? s.pago_q1,
    pago_q2: pago_q2 ?? s.pago_q2,
    contar_intereses_en_total: contar_intereses_en_total ?? s.contar_intereses_en_total,
    updated_at: new Date(),
  });
  res.json(s);
};
