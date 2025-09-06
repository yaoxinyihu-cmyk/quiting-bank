function pad(n) { 
  return n < 10 ? '0' + n : '' + n; 
}

/** 生成某年某月的 6x7 月历矩阵 */
function buildMonthMatrix(year, month) {
  const first = new Date(year, month - 1, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevDays = new Date(prevYear, prevMonth, 0).getDate();

  const cells = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ y: prevYear, m: prevMonth, d: prevDays - i, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: year, m: month, d, inMonth: true });
  }
  const need = 42 - cells.length;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  for (let d = 1; d <= need; d++) {
    cells.push({ y: nextYear, m: nextMonth, d, inMonth: false });
  }
  const matrix = [];
  for (let r = 0; r < 6; r++) matrix.push(cells.slice(r * 7, r * 7 + 7));
  return matrix;
}

module.exports = { pad, buildMonthMatrix };
