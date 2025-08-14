// routes/index.js
module.exports = (app) => {
  app.use('/api/movimientos', require('./movimientos.routes'));
  app.use('/api/settings',    require('./settings.routes'));
  app.use('/api/templates',   require('./templates.routes'));
  app.use('/api/resumen',     require('./resumen.routes'));

  // healthcheck opcional
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
};
