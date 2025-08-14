module.exports = (sequelize, DataTypes) => {
  const Movimiento = sequelize.define('movimientos', {
    id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fecha:      { type: DataTypes.DATEONLY, allowNull: false },
    mes_key:    { type: DataTypes.STRING(7), allowNull: false }, // 'YYYY-MM'
    quincena:   { type: DataTypes.ENUM('Q1 (1-16)', 'Q2 (17-fin)'), allowNull: false },
    tipo:       { type: DataTypes.ENUM('Gasto','Ingreso'), allowNull: false },
    categoria:  { type: DataTypes.STRING(80), allowNull: false },
    monto:      { type: DataTypes.DECIMAL(12,2), allowNull: false },
    nota:       { type: DataTypes.STRING(255) },
    es_extra:   { type: DataTypes.BOOLEAN, defaultValue: false },
    es_prestamo:{ type: DataTypes.BOOLEAN, defaultValue: false },
    es_interes: { type: DataTypes.BOOLEAN, defaultValue: false },
    ts:         { type: DataTypes.BIGINT, defaultValue: () => Date.now() },
  }, { tableName: 'movimientos', timestamps: false });
  return Movimiento;
};
