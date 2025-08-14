// index.js (tu server actual)
const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }));

const db = require("./models");
const seed = require('./utils/seed');

db.sequelize.sync().then(async () => {
  console.log("db resync");
  await seed(db);
});

// Rutas
require('./routes')(app);

// Manejo de error JSON malformado
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).json({ msg: 'Error en el JSON' });
  } else {
    next();
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Servidor corriendo en http://localhost:3000');
});
