/**
 * Hospital Feature - Appointment Management
 * View appointments assigned to this hospital (approved by Admin) with child & parent details
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { bookingService } from "../../services/BookingService.js";
import { appState } from "../../core/state.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderHospitalAppointmentsView() {
  const user = appState.getCurrentUser();
  const hospitalId = user?.hospitalId || "hosp-1";
  const appointments = bookingService.getBookingsByHospital(hospitalId);

  return `
    <div class="app-shell">
      ${renderSidebar("appointments")}

      <div class="app-main-layout">
        ${renderNavbar("Appointment Management", ["Hospital", "Clinical Operations", "Appointment Queue"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Approved Patient Appointments</h1>
              <p class="page-header-subtitle">Review scheduled patients approved by Health Admin and prepare vaccination dose allocations</p>
            </div>
            <div class="page-header-actions">
              <a href="#hospital/status" class="btn btn-primary">
                Update Vaccine Status
              </a>
            </div>
          </div>

          <!-- Filter Toolbar -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; flex:1;">
                <div style="position:relative; min-width: 260px;">
                  <input type="text" id="hosp-apt-search" class="form-control" placeholder="Search child or parent name...">
                </div>

                <select id="hosp-apt-status" class="form-control" style="width: 170px;">
                  <option value="all">All Appointments</option>
                  <option value="Approved" selected>Approved (Upcoming)</option>
                  <option value="Vaccinated">Vaccinated</option>
                  <option value="Not Vaccinated">Not Vaccinated</option>
                </select>
              </div>

              <div class="text-sm font-semibold" style="color:var(--text-muted);" id="hosp-apt-count">
                ${appointments.length} Appointments Found
              </div>
            </div>
          </div>

          <!-- Appointments Table -->
          <div class="glass-card" id="hosp-appointments-container">
            ${renderHospitalAppointmentsTable(appointments)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderHospitalAppointmentsTable(appointments) {
  if (appointments.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No appointments currently assigned to your facility for this filter.</div>`;
  }

  const rowsHtml = appointments
    .map(
      a => `
      <tr>
        <td>
          <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:0.9rem;">
            ${a.bookingId}
          </span>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${a.childName}</div>
          <div class="text-xs" style="color:var(--text-muted);">DOB: ${formatDate(a.childDob)}</div>
        </td>
        <td>
          <div style="font-weight:600;">${a.parentName}</div>
          <div class="text-xs" style="color:var(--text-muted);">${a.parentPhone}</div>
        </td>
        <td>
          <div class="glass-pill glass-pill-primary" style="font-size:0.75rem;">
            ${a.vaccineName}
          </div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${formatDate(a.appointmentDate)}</div>
          <div class="text-xs" style="color:var(--text-muted);">${a.appointmentTime}</div>
        </td>
        <td>
          ${formatStatusBadge(a.status)}
        </td>
        <td>
          ${
            a.status === "Approved"
              ? `
            <a href="#hospital/status" class="btn btn-primary btn-sm" style="font-size:0.75rem;">
              Administer / Update
            </a>
          `
              : `
            <span class="text-xs font-semibold" style="color:var(--text-light);">
              ${a.batchNumber ? `Batch: ${a.batchNumber}` : "Logged"}
            </span>
          `
          }
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="table-responsive">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Child Details</th>
            <th>Parent Details</th>
            <th>Selected Vaccine</th>
            <th>Appointment Date & Time</th>
            <th>Status</th>
            <th style="text-align:right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

export function attachHospitalAppointmentsEvents() {
  attachNavbarEvents();

  const searchInput = document.getElementById("hosp-apt-search");
  const statusFilter = document.getElementById("hosp-apt-status");
  const container = document.getElementById("hosp-appointments-container");
  const countLabel = document.getElementById("hosp-apt-count");

  const user = appState.getCurrentUser();
  const hospitalId = user?.hospitalId || "hosp-1";

  function filterAppointments() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    let list = bookingService.getBookingsByHospital(hospitalId);

    if (status && status !== "all") {
      list = list.filter(a => a.status === status);
    }

    if (search) {
      list = list.filter(
        a =>
          a.childName.toLowerCase().includes(search) ||
          a.parentName.toLowerCase().includes(search) ||
          a.bookingId.toLowerCase().includes(search) ||
          a.vaccineName.toLowerCase().includes(search)
      );
    }

    container.innerHTML = renderHospitalAppointmentsTable(list);
    if (countLabel) countLabel.textContent = `${list.length} Appointments Found`;
  }

  if (searchInput) searchInput.addEventListener("input", filterAppointments);
  if (statusFilter) statusFilter.addEventListener("change", filterAppointments);
}
