module.exports = (sequelize, DataTypes) => {
  const Suscripcion = sequelize.define('suscripciones', {
    id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoria: { type: DataTypes.STRING(80), allowNull: false },
    monto:     { type: DataTypes.DECIMAL(12,2), allowNull: false },
    nota:      { type: DataTypes.STRING(255) },
  }, { tableName: 'suscripciones', timestamps: false });
  return Suscripcion;
};
