const toMonthKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};
const getQuincenaLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.getDate() <= 16 ? 'Q1 (1-16)' : 'Q2 (17-fin)';
};
module.exports = { toMonthKey, getQuincenaLabel };
