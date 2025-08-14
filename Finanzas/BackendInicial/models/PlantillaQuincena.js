module.exports = (sequelize, DataTypes) => {
  const PlantillaQuincena = sequelize.define('plantilla_quincena', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quincena:    { type: DataTypes.ENUM('Q1 (1-16)','Q2 (17-fin)'), allowNull: false },
    tipo:        { type: DataTypes.ENUM('Gasto','Ingreso'), defaultValue: 'Gasto' },
    categoria:   { type: DataTypes.STRING(80), allowNull: false },
    monto:       { type: DataTypes.DECIMAL(12,2), allowNull: false },
    nota:        { type: DataTypes.STRING(255) },
    es_extra:    { type: DataTypes.BOOLEAN, defaultValue: false },
    es_prestamo: { type: DataTypes.BOOLEAN, defaultValue: false },
    es_interes:  { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'plantilla_quincena', timestamps: false });
  return PlantillaQuincena;
};
