/**
 * Parent Feature - Book Hospital & Request Appointment
 * Multi-step glass booking wizard: Hospital Select -> Child Select -> Vaccine -> Slot -> Submit
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { hospitalService } from "../../services/HospitalService.js";
import { childService } from "../../services/ChildService.js";
import { vaccineService } from "../../services/VaccineService.js";
import { bookingService } from "../../services/BookingService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { appState } from "../../core/state.js";
import { TIME_SLOTS, PAKISTAN_CITIES } from "../../core/constants.js";

export function renderParentBookView() {
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";
  const children = childService.getChildrenByParent(parentId);
  const hospitals = hospitalService.getAllHospitals();
  const vaccines = vaccineService.getAvailableVaccines();

  const childOpts = children
    .map(c => `<option value="${c.id}">${c.name} (${c.gender}, DOB: ${c.dob})</option>`)
    .join("");

  const hospOpts = hospitals
    .map(h => `<option value="${h.id}">${h.name} — ${h.city}</option>`)
    .join("");

  const vacOpts = vaccines
    .map(v => `<option value="${v.id}">${v.name} (For: ${v.recommendedAge})</option>`)
    .join("");

  const timeOpts = TIME_SLOTS.map(t => `<option value="${t}">${t}</option>`).join("");
  const cityOpts = PAKISTAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join("");

  return `
    <div class="app-shell">
      ${renderSidebar("book")}

      <div class="app-main-layout">
        ${renderNavbar("Book Hospital Appointment", ["Parent", "Appointments", "Book Slot"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Schedule a Hospital Vaccination</h1>
              <p class="page-header-subtitle">Select an accredited center, choose your child & vaccine, and submit an appointment request</p>
            </div>
          </div>

          <div class="grid-two-column">
            <!-- Left Column: Booking Form -->
            <div class="glass-card">
              <div class="panel-header" style="margin-bottom: 1.5rem;">
                <h3 class="panel-title">Appointment Request Form</h3>
                <span class="glass-pill glass-pill-primary">Validated Booking</span>
              </div>

              <form id="parent-booking-form" novalidate>
                <!-- 1. Select Child -->
                <div class="form-group">
                  <label class="form-label" for="booking-child-select">
                    1. Select Child <span class="required-star">*</span>
                  </label>
                  <select id="booking-child-select" name="selectRequired" class="form-control" required>
                    <option value="">-- Choose registered child --</option>
                    ${childOpts}
                  </select>
                </div>

                <!-- 2. Select Hospital -->
                <div class="form-group">
                  <label class="form-label" for="booking-hosp-select">
                    2. Select Accredited Hospital / Center <span class="required-star">*</span>
                  </label>
                  <select id="booking-hosp-select" name="selectRequired" class="form-control" required>
                    <option value="">-- Choose hospital or vaccination center --</option>
                    ${hospOpts}
                  </select>
                </div>

                <!-- 3. Select Vaccine Formulation -->
                <div class="form-group">
                  <label class="form-label" for="booking-vac-select">
                    3. Select Vaccine Formulation <span class="required-star">*</span>
                  </label>
                  <select id="booking-vac-select" name="selectRequired" class="form-control" required>
                    <option value="">-- Choose vaccine to administer --</option>
                    ${vacOpts}
                  </select>
                </div>

                <!-- 4. Date & Time -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label" for="booking-date">
                      4. Appointment Date <span class="required-star">*</span>
                    </label>
                    <input type="date" id="booking-date" name="appointmentDate" class="form-control" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="booking-time-select">
                      5. Preferred Time Slot <span class="required-star">*</span>
                    </label>
                    <select id="booking-time-select" name="selectRequired" class="form-control" required>
                      ${timeOpts}
                    </select>
                  </div>
                </div>

                <!-- 5. Additional Parent Request Notes -->
                <div class="form-group">
                  <label class="form-label" for="booking-notes">Special Requests / Clinical Notes</label>
                  <textarea id="booking-notes" name="notes" class="form-control" placeholder="Mention previous shot reactions, mild cold symptoms, or pediatrician advice..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.5rem;">
                  Submit Appointment Request to Health Admin
                </button>
              </form>
            </div>

            <!-- Right Column: Hospital Directory Preview -->
            <div>
              <div class="glass-card" style="margin-bottom: 1.5rem;">
                <div class="panel-header">
                  <h3 class="panel-title">Explore Centers</h3>
                  <select id="browse-city-select" class="form-control" style="width: 130px; font-size: 0.75rem;">
                    <option value="all">All Cities</option>
                    ${cityOpts}
                  </select>
                </div>

                <div id="hospital-browse-list" style="max-height: 440px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
                  ${renderHospitalPreviews(hospitals)}
                </div>
              </div>

              <!-- Workflow Notice -->
              <div class="glass-card" style="background: rgba(91, 141, 239, 0.08); border-color: rgba(91, 141, 239, 0.3);">
                <div style="display:flex; align-items:center; gap: 8px; margin-bottom: 0.4rem;">
                  <span class="macos-dot macos-dot-zoom" style="width:10px; height:10px;"></span>
                  <strong style="color:var(--dark-navy); font-size:0.9rem;">Simulation Workflow</strong>
                </div>
                <p class="text-xs" style="line-height:1.5;">
                  Once submitted, your booking enters <strong>Pending</strong> state. The Health Admin approves it from their portal, whereupon it appears in the Hospital's clinical vaccination queue!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderHospitalPreviews(hospitals) {
  return hospitals
    .map(
      h => `
      <div style="padding: 0.85rem; background: var(--glass-bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--glass-border-subtle); cursor:pointer;" class="hospital-preview-card" data-hosp-id="${h.id}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2px;">
          <strong style="color:var(--dark-navy); font-size:0.88rem;">${h.name}</strong>
          <span class="text-xs" style="color:var(--primary); font-weight:700;">${h.city}</span>
        </div>
        <div class="text-xs" style="color:var(--text-muted); margin-bottom: 4px;">${h.address}</div>
        <div style="font-size:0.75rem; color:var(--status-success-text); font-weight:600;">
          📞 ${h.phone} • Verified Center
        </div>
      </div>
    `
    )
    .join("");
}

export function attachParentBookEvents() {
  attachNavbarEvents();

  const form = document.getElementById("parent-booking-form");
  const dateInput = document.getElementById("booking-date");
  const hospSelect = document.getElementById("booking-hosp-select");
  const citySelect = document.getElementById("browse-city-select");
  const browseList = document.getElementById("hospital-browse-list");

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    // default to 3 days in future
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    dateInput.value = defaultDate.toISOString().split("T")[0];
  }

  // Live validation
  validationService.attachLiveValidation(form);

  // Click on hospital preview card autofills the dropdown
  document.querySelectorAll(".hospital-preview-card").forEach(card => {
    card.addEventListener("click", () => {
      const hid = card.getAttribute("data-hosp-id");
      if (hospSelect) {
        hospSelect.value = hid;
        notificationService.showToast("Selected hospital in booking form.", "info");
      }
    });
  });

  // Filter hospital previews by city
  if (citySelect && browseList) {
    citySelect.addEventListener("change", () => {
      const city = citySelect.value;
      const filtered = hospitalService.searchHospitals({ city });
      browseList.innerHTML = renderHospitalPreviews(filtered);
    });
  }

  // Form submit
  form.addEventListener("submit", e => {
    e.preventDefault();
    const isValid = validationService.validateForm(form);
    if (!isValid) {
      notificationService.showToast("Please complete all required booking fields correctly.", "error");
      return;
    }

    const user = appState.getCurrentUser();
    const childId = document.getElementById("booking-child-select").value;
    const hospId = document.getElementById("booking-hosp-select").value;
    const vacId = document.getElementById("booking-vac-select").value;
    const aptDate = dateInput.value;
    const aptTime = document.getElementById("booking-time-select").value;
    const notes = document.getElementById("booking-notes").value;

    const child = childService.getChildById(childId);
    const hospital = hospitalService.getHospitalById(hospId);
    const vaccine = vaccineService.getVaccineById(vacId);

    if (!child || !hospital || !vaccine) {
      notificationService.showToast("Invalid selection details.", "error");
      return;
    }

    const newBooking = bookingService.createBooking({
      parentUser: user || { id: "user-parent-1", name: "Fatima Ahmed", email: "fatima@gmail.com", phone: "03001234567" },
      child,
      hospital,
      vaccine,
      appointmentDate: aptDate,
      appointmentTime: aptTime,
      notes
    });

    notificationService.showToast(`Request submitted! Booking ID: ${newBooking.bookingId}`, "success");
    setTimeout(() => {
      window.location.hash = "#parent/requests";
    }, 1200);
  });
}
