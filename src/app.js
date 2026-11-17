// Regras puras (datas, escape, disponibilidade) ficam em src/logic.js,
// carregado antes deste arquivo e testado em tests/logic.test.js.
const { escapeHtml, toLocalISO, getTodayISO, addDays, isPastSlot, isSlotTaken } = window.AgendaLogic;

const services = [
  {
    id: "haircut",
    name: "Corte masculino",
    description: "Atendimento rapido com acabamento incluso.",
    duration: 45,
    price: 55,
  },
  {
    id: "beard",
    name: "Barba completa",
    description: "Toalha quente, desenho e finalizacao.",
    duration: 35,
    price: 40,
  },
  {
    id: "skin",
    name: "Limpeza de pele",
    description: "Sessao leve para manutencao mensal.",
    duration: 60,
    price: 120,
  },
  {
    id: "consult",
    name: "Consultoria",
    description: "Avaliacao personalizada com recomendacoes.",
    duration: 50,
    price: 90,
  },
];

const professionals = [
  { id: "marina", name: "Marina Costa", specialty: "Estetica e consultoria" },
  { id: "rafael", name: "Rafael Lima", specialty: "Cortes e barba" },
  { id: "bianca", name: "Bianca Alves", specialty: "Atendimento premium" },
];

const storeKey = "agendaflow-appointments";
const state = {
  selectedServiceId: services[0].id,
  selectedProfessionalId: professionals[0].id,
  selectedSlot: "",
  appointments: [],
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

const elements = {
  serviceOptions: document.querySelector("#service-options"),
  professionalOptions: document.querySelector("#professional-options"),
  slotOptions: document.querySelector("#slot-options"),
  dateInput: document.querySelector("#date-input"),
  form: document.querySelector("#booking-form"),
  message: document.querySelector("#booking-message"),
  customerName: document.querySelector("#customer-name"),
  customerPhone: document.querySelector("#customer-phone"),
  customerNotes: document.querySelector("#customer-notes"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  appointmentsList: document.querySelector("#appointments-list"),
  statusFilter: document.querySelector("#status-filter"),
  searchInput: document.querySelector("#search-input"),
  metricToday: document.querySelector("#metric-today"),
  metricConfirmed: document.querySelector("#metric-confirmed"),
  metricRevenue: document.querySelector("#metric-revenue"),
  resetDemo: document.querySelector("#reset-demo"),
};

function createDemoAppointments() {
  const today = getTodayISO();
  return [
    {
      id: crypto.randomUUID(),
      serviceId: "haircut",
      professionalId: "rafael",
      date: today,
      time: "10:00",
      customerName: "Lucas Pereira",
      customerPhone: "(11) 98888-1212",
      notes: "Cliente prefere maquina 2 nas laterais.",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      serviceId: "skin",
      professionalId: "marina",
      date: addDays(today, 1),
      time: "14:00",
      customerName: "Camila Rocha",
      customerPhone: "(11) 97777-3434",
      notes: "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    },
  ];
}

function loadAppointments() {
  const saved = localStorage.getItem(storeKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Descarta registros que apontam para serviço ou profissional que não existe mais.
        state.appointments = parsed.filter(
          (appointment) => findService(appointment.serviceId) && findProfessional(appointment.professionalId),
        );
        return;
      }
    } catch (error) {
      console.warn("Agendamentos salvos estavam corrompidos; usando os dados de demonstração.", error);
    }
  }

  state.appointments = createDemoAppointments();
  saveAppointments();
}

function saveAppointments() {
  localStorage.setItem(storeKey, JSON.stringify(state.appointments));
}

function findService(id) {
  return services.find((service) => service.id === id);
}

function findProfessional(id) {
  return professionals.find((professional) => professional.id === id);
}

function renderServices() {
  elements.serviceOptions.innerHTML = services
    .map((service) => {
      const active = service.id === state.selectedServiceId ? "active" : "";
      return `
        <button class="option-card ${active}" type="button" data-service-id="${service.id}">
          <strong>${service.name}</strong>
          <span>${service.description}</span>
          <span>${service.duration} min · ${money.format(service.price)}</span>
        </button>
      `;
    })
    .join("");
}

function renderProfessionals() {
  elements.professionalOptions.innerHTML = professionals
    .map((professional) => {
      const active = professional.id === state.selectedProfessionalId ? "active" : "";
      return `
        <button class="option-card ${active}" type="button" data-professional-id="${professional.id}">
          <strong>${professional.name}</strong>
          <span>${professional.specialty}</span>
        </button>
      `;
    })
    .join("");
}

function generateSlots() {
  return ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
}

function isSlotBooked(time) {
  return isSlotTaken(state.appointments, elements.dateInput.value, time, state.selectedProfessionalId);
}

function isSlotPast(time) {
  return isPastSlot(elements.dateInput.value, time, new Date());
}

function isSlotUnavailable(time) {
  return isSlotBooked(time) || isSlotPast(time);
}

function renderSlots() {
  const selectedDate = elements.dateInput.value;
  elements.slotOptions.innerHTML = generateSlots()
    .map((time) => {
      const booked = isSlotUnavailable(time);
      const active = time === state.selectedSlot ? "active" : "";
      return `
        <button class="slot ${active}" type="button" data-slot="${time}" ${booked ? "disabled" : ""}>
          ${time}
        </button>
      `;
    })
    .join("");

  if (!selectedDate) {
    elements.slotOptions.innerHTML = '<p class="muted">Escolha uma data para ver os horarios.</p>';
  }
}

function renderMetrics() {
  const today = getTodayISO();
  const activeAppointments = state.appointments.filter((appointment) => appointment.status !== "cancelled");
  const todayTotal = activeAppointments.filter((appointment) => appointment.date === today).length;
  const confirmed = state.appointments.filter((appointment) => appointment.status === "confirmed").length;
  const revenue = activeAppointments.reduce((sum, appointment) => {
    return sum + findService(appointment.serviceId).price;
  }, 0);

  elements.metricToday.textContent = todayTotal;
  elements.metricConfirmed.textContent = confirmed;
  elements.metricRevenue.textContent = money.format(revenue);
}

function appointmentMatchesFilters(appointment) {
  const status = elements.statusFilter.value;
  const term = elements.searchInput.value.trim().toLowerCase();
  const service = findService(appointment.serviceId);
  const professional = findProfessional(appointment.professionalId);

  const statusMatches = status === "all" || appointment.status === status;
  const searchMatches =
    !term ||
    appointment.customerName.toLowerCase().includes(term) ||
    service.name.toLowerCase().includes(term) ||
    professional.name.toLowerCase().includes(term);

  return statusMatches && searchMatches;
}

function renderAppointments() {
  const appointments = state.appointments
    .filter(appointmentMatchesFilters)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (!appointments.length) {
    elements.appointmentsList.innerHTML = '<div class="empty-state">Nenhum agendamento encontrado.</div>';
    return;
  }

  elements.appointmentsList.innerHTML = appointments
    .map((appointment) => {
      const service = findService(appointment.serviceId);
      const professional = findProfessional(appointment.professionalId);
      const readableDate = dateFormatter.format(new Date(`${appointment.date}T12:00:00`));
      return `
        <article class="appointment">
          <div>
            <time>${readableDate} · ${appointment.time}</time>
            <p>${service.name} · ${money.format(service.price)}</p>
          </div>
          <div>
            <strong>${escapeHtml(appointment.customerName)}</strong>
            <p>${professional.name} · ${escapeHtml(appointment.customerPhone)}</p>
            ${appointment.notes ? `<p>${escapeHtml(appointment.notes)}</p>` : ""}
          </div>
          <div class="appointment-actions">
            <span class="badge ${appointment.status}">${translateStatus(appointment.status)}</span>
            ${appointment.status === "confirmed" ? `
            <button class="icon-action" type="button" title="Concluir" data-status-id="${appointment.id}" data-next-status="completed">✓</button>
            <button class="icon-action" type="button" title="Cancelar" data-status-id="${appointment.id}" data-next-status="cancelled">×</button>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function translateStatus(status) {
  const labels = {
    confirmed: "Confirmado",
    completed: "Concluido",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
}

function renderAll() {
  renderServices();
  renderProfessionals();
  renderSlots();
  renderMetrics();
  renderAppointments();
}

function selectService(serviceId) {
  state.selectedServiceId = serviceId;
  renderServices();
}

function selectProfessional(professionalId) {
  state.selectedProfessionalId = professionalId;
  state.selectedSlot = "";
  renderProfessionals();
  renderSlots();
}

function selectSlot(time) {
  state.selectedSlot = time;
  renderSlots();
}

function createAppointment(event) {
  event.preventDefault();
  elements.message.textContent = "";

  if (!state.selectedSlot) {
    elements.message.textContent = "Escolha um horario disponivel.";
    return;
  }

  if (isSlotUnavailable(state.selectedSlot)) {
    elements.message.textContent = "Esse horario acabou de ficar indisponivel.";
    renderSlots();
    return;
  }

  const appointment = {
    id: crypto.randomUUID(),
    serviceId: state.selectedServiceId,
    professionalId: state.selectedProfessionalId,
    date: elements.dateInput.value,
    time: state.selectedSlot,
    customerName: elements.customerName.value.trim(),
    customerPhone: elements.customerPhone.value.trim(),
    notes: elements.customerNotes.value.trim(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  state.appointments.push(appointment);
  saveAppointments();
  state.selectedSlot = "";
  elements.form.reset();
  elements.dateInput.value = getTodayISO();
  elements.message.textContent = "Agendamento confirmado.";
  renderAll();
}

function updateAppointmentStatus(id, status) {
  state.appointments = state.appointments.map((appointment) => {
    // Só agendamentos confirmados mudam de status: concluído e cancelado são finais.
    if (appointment.id !== id || appointment.status !== "confirmed") {
      return appointment;
    }

    return { ...appointment, status };
  });
  saveAppointments();
  renderAll();
}

function switchView(viewName) {
  elements.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
  elements.views.forEach((view) => {
    view.classList.toggle("active", view.id === `${viewName}-view`);
  });
}

function bindEvents() {
  elements.serviceOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-service-id]");
    if (button) {
      selectService(button.dataset.serviceId);
    }
  });

  elements.professionalOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-professional-id]");
    if (button) {
      selectProfessional(button.dataset.professionalId);
    }
  });

  elements.slotOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-slot]");
    if (button) {
      selectSlot(button.dataset.slot);
    }
  });

  elements.dateInput.addEventListener("change", () => {
    state.selectedSlot = "";
    renderSlots();
  });

  elements.form.addEventListener("submit", createAppointment);

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  elements.statusFilter.addEventListener("change", renderAppointments);
  elements.searchInput.addEventListener("input", renderAppointments);

  elements.appointmentsList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-status-id]");
    if (button) {
      updateAppointmentStatus(button.dataset.statusId, button.dataset.nextStatus);
    }
  });

  elements.resetDemo.addEventListener("click", () => {
    state.appointments = createDemoAppointments();
    elements.statusFilter.value = "all";
    elements.searchInput.value = "";
    saveAppointments();
    renderAll();
  });
}

function init() {
  elements.dateInput.min = getTodayISO();
  elements.dateInput.value = getTodayISO();
  loadAppointments();
  bindEvents();
  renderAll();
}

init();
