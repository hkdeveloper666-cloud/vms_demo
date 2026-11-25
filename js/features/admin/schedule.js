/**
 * Admin Feature - Date & Time of Vaccination (Schedules)
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { bookingService } from "../../services/BookingService.js";
import { hospitalService } from "../../services/HospitalService.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderAdminScheduleView() {
  const bookings = bookingService.getAllBookings();
  const hospitals = hospitalService.getAllHospitals();

  const hospOptions = hospitals
    .map(h => `<option value="${h.id}">${h.name}</option>`)
    .join("");

  return `
    <div class="app-shell">
      ${renderSidebar("schedule")}

      <div class="app-main-layout">
        ${renderNavbar("Date & Time of Vaccination", ["Admin", "Vaccination Schedule"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Vaccination Dates & Schedules</h1>
              <p class="page-header-subtitle">Monitor upcoming vaccination appointments and schedule allocations across all children</p>
            </div>
          </div>

          <!-- Schedule Filters -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center;">
              <!-- Date Filter -->
              <div style="display:flex; align-items:center; gap: 8px;">
                <label for="schedule-date-filter" class="text-sm font-semibold">Date:</label>
                <input type="date" id="schedule-date-filter" class="form-control" style="width: 170px;">
              </div>

              <!-- Hospital Filter -->
              <div style="display:flex; align-items:center; gap: 8px;">
                <label for="schedule-hospital-filter" class="text-sm font-semibold">Hospital:</label>
                <select id="schedule-hospital-filter" class="form-control" style="width: 220px;">
                  <option value="">All Healthcare Centers</option>
                  ${hospOptions}
                </select>
              </div>

              <!-- Status Filter -->
              <div style="display:flex; align-items:center; gap: 8px;">
                <label for="schedule-status-filter" class="text-sm font-semibold">Status:</label>
                <select id="schedule-status-filter" class="form-control" style="width: 160px;">
                  <option value="all">All Appointments</option>
                  <option value="Approved" selected>Upcoming (Approved)</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Vaccinated">Completed Doses</option>
                </select>
              </div>

              <button id="reset-schedule-filters" class="btn btn-ghost btn-sm" style="margin-left:auto;">
                Reset Filters
              </button>
            </div>
          </div>

          <!-- Schedule Table -->
          <div class="glass-card" id="schedule-table-container">
            ${renderScheduleTable(bookings.filter(b => b.status === "Approved"))}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderScheduleTable(items) {
  if (items.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No vaccination schedules match the selected filters.</div>`;
  }

  const rowsHtml = items
    .map(
      item => `
      <tr>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${item.childName}</div>
          <div class="text-xs" style="color:var(--text-muted);">${item.parentName} (${item.parentPhone})</div>
        </td>
        <td>
          <div class="glass-pill glass-pill-primary" style="font-size:0.75rem;">
            ${item.vaccineName}
          </div>
        </td>
        <td>
          <div style="font-weight:600;">${item.hospitalName}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--primary);">${formatDate(item.appointmentDate)}</div>
          <div class="text-xs" style="color:var(--text-muted);">${item.appointmentTime}</div>
        </td>
        <td>${formatStatusBadge(item.status)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="table-responsive">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Child & Parent Info</th>
            <th>Vaccine</th>
            <th>Assigned Hospital</th>
            <th>Date & Time of Vaccination</th>
            <th>Schedule Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

export function attachAdminScheduleEvents() {
  attachNavbarEvents();

  const dateFilter = document.getElementById("schedule-date-filter");
  const hospFilter = document.getElementById("schedule-hospital-filter");
  const statusFilter = document.getElementById("schedule-status-filter");
  const resetBtn = document.getElementById("reset-schedule-filters");
  const container = document.getElementById("schedule-table-container");

  function filterData() {
    const date = dateFilter.value;
    const hospitalId = hospFilter.value;
    const status = statusFilter.value;

    const filtered = bookingService.filterBookings({
      date,
      hospitalId,
      status: status === "all" ? "" : status
    });

    container.innerHTML = renderScheduleTable(filtered);
  }

  if (dateFilter) dateFilter.addEventListener("change", filterData);
  if (hospFilter) hospFilter.addEventListener("change", filterData);
  if (statusFilter) statusFilter.addEventListener("change", filterData);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      dateFilter.value = "";
      hospFilter.value = "";
      statusFilter.value = "all";
      filterData();
    });
  }
}
