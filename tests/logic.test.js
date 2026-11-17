// node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeHtml, toLocalISO, getTodayISO, addDays, isPastSlot, isSlotTaken } = require("../src/logic.js");

test("escapeHtml neutraliza HTML", () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  assert.equal(escapeHtml("D'Ávila & Cia"), "D&#39;Ávila &amp; Cia");
  assert.equal(escapeHtml(null), "");
});

test("toLocalISO usa o fuso local, não UTC", () => {
  // 23h30 do dia 17 no horário local continua sendo o dia 17.
  assert.equal(toLocalISO(new Date(2026, 10, 17, 23, 30)), "2026-11-17");
  assert.equal(getTodayISO(new Date(2026, 0, 1, 0, 5)), "2026-01-01");
});

test("addDays vira mês e ano", () => {
  assert.equal(addDays("2026-02-28", 1), "2026-03-01");
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
});

test("isPastSlot só bloqueia horários de hoje que já passaram", () => {
  const agora = new Date(2026, 10, 17, 11, 53);
  assert.equal(isPastSlot("2026-11-17", "11:00", agora), true);
  assert.equal(isPastSlot("2026-11-17", "11:53", agora), true);
  assert.equal(isPastSlot("2026-11-17", "13:00", agora), false);
  assert.equal(isPastSlot("2026-11-18", "09:00", agora), false);
});

test("isSlotTaken considera profissional e ignora cancelados", () => {
  const ags = [
    { date: "2026-11-18", time: "10:00", professionalId: "rafael", status: "confirmed" },
    { date: "2026-11-18", time: "14:00", professionalId: "rafael", status: "cancelled" },
  ];
  assert.equal(isSlotTaken(ags, "2026-11-18", "10:00", "rafael"), true);
  assert.equal(isSlotTaken(ags, "2026-11-18", "10:00", "marina"), false);
  assert.equal(isSlotTaken(ags, "2026-11-18", "14:00", "rafael"), false);
  assert.equal(isSlotTaken(ags, "2026-11-19", "10:00", "rafael"), false);
});
