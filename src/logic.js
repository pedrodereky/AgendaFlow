// Regras do AgendaFlow sem dependência de DOM, para poderem ser testadas.
// No navegador ficam em window.AgendaLogic; no Node, em module.exports.
(function (root) {
  // Texto digitado pelo usuário vai para o innerHTML; precisa ser escapado.
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Datas no fuso do navegador. toISOString() usa UTC: no Brasil, depois das 21h,
  // "hoje" virava o dia seguinte.
  function toLocalISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getTodayISO(now = new Date()) {
    return toLocalISO(now);
  }

  function addDays(isoDate, days) {
    const [year, month, day] = isoDate.split("-").map(Number);
    return toLocalISO(new Date(year, month - 1, day + days));
  }

  // Horário de hoje que já passou não pode ser agendado.
  function isPastSlot(dateISO, time, now = new Date()) {
    if (dateISO !== toLocalISO(now)) return false;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute <= now.getHours() * 60 + now.getMinutes();
  }

  // Mesmo profissional, mesma data e hora, e agendamento não cancelado.
  function isSlotTaken(appointments, dateISO, time, professionalId) {
    return appointments.some(
      (appointment) =>
        appointment.date === dateISO &&
        appointment.time === time &&
        appointment.professionalId === professionalId &&
        appointment.status !== "cancelled",
    );
  }

  const api = { escapeHtml, toLocalISO, getTodayISO, addDays, isPastSlot, isSlotTaken };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AgendaLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
