/**
 * Admin Feature - Booking Details
 * Comprehensive registry of all bookings with advanced search, status filters, and details modal
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { bookingService } from "../../services/BookingService.js";
import { modal } from "../../components/Modal.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderAdminBookingsView() {
  const bookings = bookingService.getAllBookings();

  return `
    <div class="app-shell">
      ${renderSidebar("bookings")}

      <div class="app-main-layout">
        ${renderNavbar("Booking Details", ["Admin", "Booking Register"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Master Appointment Bookings Ledger</h1>
              <p class="page-header-subtitle">Comprehensive registry of all parent booking requests, clinical appointments, and status lifecycles</p>
            </div>
          </div>

          <!-- Filters Toolbar -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; flex:1;">
                <div style="position:relative; min-width: 280px;">
                  <input type="text" id="bookings-search-input" class="form-control" placeholder="Search by booking ID, child, parent, vaccine...">
                </div>

                <select id="bookings-status-filter" class="form-control" style="width: 170px;">
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Vaccinated">Vaccinated</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div class="text-sm font-semibold" style="color:var(--text-muted);" id="bookings-count-label">
                Showing ${bookings.length} Total Bookings
              </div>
            </div>
          </div>

          <!-- Bookings Table -->
          <div class="glass-card" id="bookings-table-container">
            ${renderBookingsTable(bookings)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderBookingsTable(bookings) {
  if (bookings.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No booking records match your search criteria.</div>`;
  }

  const rowsHtml = bookings
    .map(
      b => `
      <tr>
        <td>
          <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:0.9rem;">
            ${b.bookingId}
          </span>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${b.childName}</div>
          <div class="text-xs" style="color:var(--text-muted);">DOB: ${formatDate(b.childDob)}</div>
        </td>
        <td>
          <div style="font-weight:600;">${b.parentName}</div>
          <div class="text-xs" style="color:var(--text-muted);">${b.parentPhone}</div>
        </td>
        <td>
          <div class="glass-pill glass-pill-primary" style="font-size:0.75rem;">
            ${b.vaccineName}
          </div>
        </td>
        <td>
          <div style="font-weight:600;">${b.hospitalName}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${formatDate(b.appointmentDate)}</div>
          <div class="text-xs" style="color:var(--text-muted);">${b.appointmentTime}</div>
        </td>
        <td>
          ${formatStatusBadge(b.status)}
        </td>
        <td>
          <button class="btn btn-secondary btn-sm inspect-booking-btn" data-id="${b.id}">
            View Details
          </button>
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
            <th>Child Name</th>
            <th>Parent Name</th>
            <th>Vaccine</th>
            <th>Hospital</th>
            <th>Appointment Date & Time</th>
            <th>Status</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

export function attachAdminBookingsEvents() {
  attachNavbarEvents();

  const searchInput = document.getElementById("bookings-search-input");
  const statusFilter = document.getElementById("bookings-status-filter");
  const container = document.getElementById("bookings-table-container");
  const countLabel = document.getElementById("bookings-count-label");

  function filterList() {
    const search = searchInput.value;
    const status = statusFilter.value;
    const filtered = bookingService.filterBookings({ search, status });
    container.innerHTML = renderBookingsTable(filtered);
    if (countLabel) countLabel.textContent = `Showing ${filtered.length} Bookings`;
    attachInspectButtons();
  }

  if (searchInput) searchInput.addEventListener("input", filterList);
  if (statusFilter) statusFilter.addEventListener("change", filterList);

  function attachInspectButtons() {
    document.querySelectorAll(".inspect-booking-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const b = bookingService.getBookingById(id);
        if (!b) return;

        modal.open({
          title: `Appointment Record — ${b.bookingId}`,
          bodyHtml: `
            <div class="report-meta-grid" style="margin-bottom: 1.25rem;">
              <div class="report-meta-item">
                <strong>Booking ID</strong>
                <span>${b.bookingId}</span>
              </div>
              <div class="report-meta-item">
                <strong>Current Status</strong>
                <span>${formatStatusBadge(b.status)}</span>
              </div>
              <div class="report-meta-item">
                <strong>Submission Timestamp</strong>
                <span>${formatDate(b.createdAt)}</span>
              </div>
            </div>

            <div style="background:var(--glass-bg-subtle); padding: 1rem; border-radius:var(--radius-sm); border:1px solid var(--glass-border-subtle); margin-bottom: 1.25rem;">
              <h4 style="font-size:0.95rem; margin-bottom:0.5rem; color:var(--dark-navy);">Participant & Clinical Summary</h4>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.85rem;">
                <div><strong>Child:</strong> ${b.childName}</div>
                <div><strong>Parent:</strong> ${b.parentName} (${b.parentPhone})</div>
                <div><strong>Vaccine:</strong> ${b.vaccineName}</div>
                <div><strong>Hospital:</strong> ${b.hospitalName}</div>
                <div><strong>Scheduled:</strong> ${formatDate(b.appointmentDate)} at ${b.appointmentTime}</div>
                <div><strong>Batch Lot:</strong> ${b.batchNumber || "Pending administration"}</div>
              </div>
            </div>

            ${
              b.rejectionReason
                ? `
              <div style="background:rgba(239, 68, 68, 0.08); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid rgba(239, 68, 68, 0.2); font-size:0.85rem; color:var(--accent-rose);">
                <strong>Rejection Rationale:</strong> ${b.rejectionReason}
              </div>
            `
                : ""
            }

            ${
              b.notes
                ? `
              <div style="margin-top:0.75rem; font-size:0.85rem; color:var(--text-muted);">
                <strong>Clinical Notes:</strong> ${b.notes}
              </div>
            `
                : ""
            }
          `,
          footerHtml: `
            <button class="btn btn-primary btn-sm" onclick="modal.close()">Close</button>
          `
        });
      });
    });
  }

  attachInspectButtons();
}
