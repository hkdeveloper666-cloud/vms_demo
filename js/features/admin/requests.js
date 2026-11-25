/**
 * Admin Feature - Requests from Parents
 * Review, approve, or reject appointment bookings submitted by parents
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { bookingService } from "../../services/BookingService.js";
import { notificationService } from "../../services/NotificationService.js";
import { modal } from "../../components/Modal.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";
import { BOOKING_STATUS } from "../../core/constants.js";

export function renderAdminRequestsView() {
  const allRequests = bookingService.getAllBookings();

  return `
    <div class="app-shell">
      ${renderSidebar("requests")}

      <div class="app-main-layout">
        ${renderNavbar("Requests from Parents", ["Admin", "Appointment Approvals"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Parent Appointment Requests</h1>
              <p class="page-header-subtitle">Evaluate requested vaccination dates and dispatch approved schedules to hospital centers</p>
            </div>
          </div>

          <!-- Status Filter Tabs -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div class="auth-role-tabs" style="margin-bottom:0; max-width: 440px;">
                <button type="button" class="auth-role-tab active" data-filter="all">All Requests</button>
                <button type="button" class="auth-role-tab" data-filter="Pending">Pending Only</button>
                <button type="button" class="auth-role-tab" data-filter="Approved">Approved</button>
                <button type="button" class="auth-role-tab" data-filter="Rejected">Rejected</button>
              </div>

              <div class="text-sm font-semibold" style="color:var(--text-muted);" id="requests-count-badge">
                Showing ${allRequests.length} Requests
              </div>
            </div>
          </div>

          <!-- Requests Table -->
          <div class="glass-card" id="requests-table-container">
            ${renderRequestsTable(allRequests)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderRequestsTable(requests) {
  if (requests.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No appointment requests found in this view.</div>`;
  }

  const rowsHtml = requests
    .map(
      r => `
      <tr>
        <td>
          <strong>${r.bookingId}</strong>
          <div class="text-xs" style="color:var(--text-muted);">${formatDate(r.createdAt || r.appointmentDate)}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${r.childName}</div>
          <div class="text-xs" style="color:var(--primary); font-weight:600;">DOB: ${formatDate(r.childDob)}</div>
        </td>
        <td>
          <div style="font-weight:600;">${r.parentName}</div>
          <div class="text-xs" style="color:var(--text-muted);">${r.parentPhone} • ${r.parentEmail}</div>
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
          ${r.rejectionReason ? `<div class="text-xs" style="color:var(--accent-rose); margin-top:2px;">${r.rejectionReason}</div>` : ""}
        </td>
        <td>
          <div class="table-actions">
            ${
              r.status === BOOKING_STATUS.PENDING
                ? `
              <button class="btn btn-success btn-sm approve-request-btn" data-id="${r.id}">
                Approve
              </button>
              <button class="btn btn-danger btn-sm reject-request-btn" data-id="${r.id}">
                Reject
              </button>
            `
                : `
              <span class="text-xs" style="color:var(--text-light); font-weight:600;">Action Complete</span>
            `
            }
          </div>
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
            <th>Child Info</th>
            <th>Parent Details</th>
            <th>Vaccine</th>
            <th>Selected Hospital</th>
            <th>Date & Time</th>
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

export function attachAdminRequestsEvents() {
  attachNavbarEvents();

  const container = document.getElementById("requests-table-container");
  const countBadge = document.getElementById("requests-count-badge");
  let currentFilter = "all";

  function refreshList() {
    const all = bookingService.getAllBookings();
    const filtered = currentFilter === "all" ? all : all.filter(r => r.status === currentFilter);
    container.innerHTML = renderRequestsTable(filtered);
    if (countBadge) countBadge.textContent = `Showing ${filtered.length} Requests`;
    attachActionButtons();
  }

  // Filter tabs
  document.querySelectorAll(".auth-role-tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".auth-role-tabs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      refreshList();
    });
  });

  function attachActionButtons() {
    // Approve Request
    document.querySelectorAll(".approve-request-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const approved = bookingService.approveBooking(id);
        if (approved) {
          notificationService.showToast(`Booking ${approved.bookingId} approved. Dispatched to ${approved.hospitalName}.`, "success");
          refreshList();
        }
      });
    });

    // Reject Request with Reason Modal
    document.querySelectorAll(".reject-request-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const b = bookingService.getBookingById(id);
        if (!b) return;

        modal.open({
          title: `Reject Request — ${b.bookingId}`,
          bodyHtml: `
            <p class="text-sm" style="margin-bottom: 1rem;">
              Provide a rationale for declining appointment for <strong>${b.childName}</strong> at <strong>${b.hospitalName}</strong>:
            </p>
            <div class="form-group">
              <label class="form-label" for="reject-reason-input">Reason for Rejection <span class="required-star">*</span></label>
              <textarea id="reject-reason-input" class="form-control" placeholder="e.g. Clinic schedule booked, infant age discrepancy...">Selected clinic slot is fully booked for vaccination drive.</textarea>
            </div>
          `,
          footerHtml: `
            <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
            <button class="btn btn-danger btn-sm" id="confirm-reject-btn">Reject Appointment</button>
          `
        });

        document.getElementById("confirm-reject-btn").addEventListener("click", () => {
          const reason = document.getElementById("reject-reason-input").value;
          bookingService.rejectBooking(id, reason);
          notificationService.showToast(`Booking ${b.bookingId} was rejected.`, "warning");
          modal.close();
          refreshList();
        });
      });
    });
  }

  attachActionButtons();
}
