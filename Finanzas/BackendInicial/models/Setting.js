module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('settings', {
    id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sueldo_total_mensual:      { type: DataTypes.DECIMAL(12,2), defaultValue: 3300 },
    pago_q1:                   { type: DataTypes.DECIMAL(12,2), defaultValue: 1400 },
    pago_q2:                   { type: DataTypes.DECIMAL(12,2), defaultValue: 1900 },
    contar_intereses_en_total: { type: DataTypes.BOOLEAN, defaultValue: false },
    updated_at:                { type: DataTypes.DATE },
  }, { tableName: 'settings', timestamps: false });
  return Setting;
};
