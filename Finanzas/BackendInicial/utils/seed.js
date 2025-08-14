// utils/seed.js
module.exports = async (db) => {
  const { Setting, PlantillaQuincena, Suscripcion, Servicio } = db;

  const s = await Setting.findOne();
  if (!s) await Setting.create({ sueldo_total_mensual:3300, pago_q1:1400, pago_q2:1900, contar_intereses_en_total:false });

  const countP = await PlantillaQuincena.count();
  if (!countP) {
    await PlantillaQuincena.bulkCreate([
      { quincena:'Q1 (1-16)', tipo:'Gasto', categoria:'Pasajes',         monto:288, nota:'Gasto fijo quincenal' },
      { quincena:'Q1 (1-16)', tipo:'Gasto', categoria:'Comida',          monto:200, nota:'Gasto fijo quincenal' },
      { quincena:'Q1 (1-16)', tipo:'Gasto', categoria:'Inhaladores',     monto:80,  nota:'2 uds' },
      { quincena:'Q1 (1-16)', tipo:'Gasto', categoria:'Hidrocortizonas', monto:140, nota:'1 ud' },
      { quincena:'Q2 (17-fin)', tipo:'Gasto', categoria:'Pasajes',         monto:288, nota:'Gasto fijo quincenal' },
      { quincena:'Q2 (17-fin)', tipo:'Gasto', categoria:'Comida',          monto:200, nota:'Gasto fijo quincenal' },
      { quincena:'Q2 (17-fin)', tipo:'Gasto', categoria:'Inhaladores',     monto:80,  nota:'2 uds' },
      { quincena:'Q2 (17-fin)', tipo:'Gasto', categoria:'Hidrocortizonas', monto:140, nota:'1 ud' },
    ]);
  }

  const countS1 = await Suscripcion.count();
  if (!countS1) {
    await Suscripcion.bulkCreate([
      { categoria:'Spotify', monto:22, nota:'Plan individual' },
      { categoria:'Netflix', monto:40, nota:'Estandar' },
      { categoria:'Amazon Prime', monto:30 },
      { categoria:'Disney+', monto:39 },
    ]);
  }

  const countS2 = await Servicio.count();
  if (!countS2) {
    await Servicio.bulkCreate([
      { categoria:'WiFi/Internet', monto:180, nota:'Bimestral (prorrateo 90)' },
      { categoria:'Servicios básicos', monto:120, nota:'Luz/Agua/Gas' },
      { categoria:'Telefonía', monto:30 },
    ]);
  }
};
