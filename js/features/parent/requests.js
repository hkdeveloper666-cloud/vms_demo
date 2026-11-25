/**
 * Parent Feature - Request Status & Tracking
 * Track Pending, Approved, and Rejected requests with status badges and notes
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { bookingService } from "../../services/BookingService.js";
import { appState } from "../../core/state.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderParentRequestsView() {
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";
  const requests = bookingService.getBookingsByParent(parentId);

  return `
    <div class="app-shell">
      ${renderSidebar("requests")}

      <div class="app-main-layout">
        ${renderNavbar("Appointment Requests Status", ["Parent", "Appointments", "Request Tracker"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">My Appointment Requests Tracker</h1>
              <p class="page-header-subtitle">Real-time status tracking for hospital bookings submitted to Health Admin</p>
            </div>
            <div class="page-header-actions">
              <a href="#parent/book" class="btn btn-primary">
                + New Appointment Request
              </a>
            </div>
          </div>

          <!-- Status Filter Tabs -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div class="auth-role-tabs" style="margin-bottom:0; max-width: 440px;">
                <button type="button" class="auth-role-tab active" data-filter="all">All</button>
                <button type="button" class="auth-role-tab" data-filter="Pending">Pending</button>
                <button type="button" class="auth-role-tab" data-filter="Approved">Approved</button>
                <button type="button" class="auth-role-tab" data-filter="Vaccinated">Vaccinated</button>
                <button type="button" class="auth-role-tab" data-filter="Rejected">Rejected</button>
              </div>

              <div class="text-sm font-semibold" style="color:var(--text-muted);" id="parent-req-count">
                ${requests.length} Requests Found
              </div>
            </div>
          </div>

          <!-- Requests Table -->
          <div class="glass-card" id="parent-requests-container">
            ${renderRequestsTable(requests)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderRequestsTable(requests) {
  if (requests.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No requests matching the selected category.</div>`;
  }

  const rowsHtml = requests
    .map(
      r => `
      <tr>
        <td>
          <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:0.9rem;">
            ${r.bookingId}
          </span>
          <div class="text-xs" style="color:var(--text-muted);">${formatDate(r.createdAt)}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${r.childName}</div>
        </td>
        <td>
          <div class="glass-pill glass-pill-primary" style="font-size:0.75rem;">${r.vaccineName}</div>
        </td>
        <td>
          <div style="font-weight:600;">${r.hospitalName}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${formatDate(r.appointmentDate)}</div>
          <div class="text-xs" style="color:var(--text-muted);">${r.appointmentTime}</div>
        </td>
        <td>
          ${formatStatusBadge(r.status)}
          ${r.rejectionReason ? `<div class="text-xs" style="color:var(--accent-rose); margin-top:2px;">Reason: ${r.rejectionReason}</div>` : ""}
          ${r.batchNumber ? `<div class="text-xs" style="color:var(--status-success-text); margin-top:2px;">Batch: ${r.batchNumber}</div>` : ""}
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
            <th>Vaccine</th>
            <th>Requested Hospital</th>
            <th>Appointment Date & Time</th>
            <th>Status / Outcome</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

export function attachParentRequestsEvents() {
  attachNavbarEvents();

  const container = document.getElementById("parent-requests-container");
  const countLabel = document.getElementById("parent-req-count");
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";

  document.querySelectorAll(".auth-role-tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".auth-role-tabs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      const all = bookingService.getBookingsByParent(parentId);
      const filtered = filter === "all" ? all : all.filter(r => r.status === filter);
      container.innerHTML = renderRequestsTable(filtered);
      if (countLabel) countLabel.textContent = `${filtered.length} Requests Found`;
    });
  });
}
