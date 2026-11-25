/**
 * Hospital Feature - Update Vaccine Status
 * Mark appointments as Vaccinated (with batch # & notes) or Not Vaccinated (with reason)
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { bookingService } from "../../services/BookingService.js";
import { vaccinationService } from "../../services/VaccinationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { appState } from "../../core/state.js";
import { modal } from "../../components/Modal.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";
import { BOOKING_STATUS } from "../../core/constants.js";

export function renderHospitalStatusView() {
  const user = appState.getCurrentUser();
  const hospitalId = user?.hospitalId || "hosp-1";
  const appointments = bookingService.getBookingsByHospital(hospitalId);

  return `
    <div class="app-shell">
      ${renderSidebar("status")}

      <div class="app-main-layout">
        ${renderNavbar("Update Vaccine Status", ["Hospital", "Clinical Verification", "Update Status"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Clinical Vaccine Status Updates</h1>
              <p class="page-header-subtitle">Record administered vaccine lot numbers, update pediatric status to Vaccinated, or log missed appointments</p>
            </div>
          </div>

          <!-- Pending Action Notice -->
          <div class="glass-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(91, 141, 239, 0.08) 100%); border-color: rgba(16, 185, 129, 0.3);">
            <div style="display:flex; align-items:center; gap: 10px;">
              <span class="macos-dot macos-dot-zoom" style="width:12px; height:12px;"></span>
              <div>
                <strong style="color:var(--dark-navy);">Direct Verification Protocol</strong>
                <p class="text-xs" style="margin:2px 0 0;">
                  Updating status to <strong>Vaccinated</strong> automatically links batch records to the child's Immunization Passport and updates national surveillance metrics.
                </p>
              </div>
            </div>
          </div>

          <!-- Appointments List For Status Updating -->
          <div class="glass-card" id="status-update-table-container">
            ${renderStatusTable(appointments)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderStatusTable(appointments) {
  if (appointments.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No appointment records found for your healthcare facility.</div>`;
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
          <div class="text-xs" style="color:var(--text-muted);">Parent: ${a.parentName} (${a.parentPhone})</div>
        </td>
        <td>
          <div class="glass-pill glass-pill-primary" style="font-size:0.75rem;">${a.vaccineName}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${formatDate(a.appointmentDate)}</div>
          <div class="text-xs" style="color:var(--text-muted);">${a.appointmentTime}</div>
        </td>
        <td>
          ${formatStatusBadge(a.status)}
          ${a.batchNumber ? `<div class="text-xs" style="color:var(--status-success-text); margin-top:2px;">Lot: ${a.batchNumber}</div>` : ""}
        </td>
        <td>
          <button class="btn btn-primary btn-sm update-clinical-status-btn" data-id="${a.id}">
            Update Vaccine Status
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
            <th>Child & Parent</th>
            <th>Vaccine</th>
            <th>Appointment Date & Time</th>
            <th>Current Status</th>
            <th style="text-align:right;">Clinical Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

export function attachHospitalStatusEvents() {
  attachNavbarEvents();

  const container = document.getElementById("status-update-table-container");
  const user = appState.getCurrentUser();
  const hospitalId = user?.hospitalId || "hosp-1";

  function refreshList() {
    const appointments = bookingService.getBookingsByHospital(hospitalId);
    container.innerHTML = renderStatusTable(appointments);
    attachUpdateModalListeners();
  }

  function attachUpdateModalListeners() {
    document.querySelectorAll(".update-clinical-status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const a = bookingService.getBookingById(id);
        if (!a) return;

        modal.open({
          title: `Update Vaccine Status — ${a.bookingId}`,
          bodyHtml: `
            <div style="margin-bottom: 1.25rem; padding: 1rem; background: var(--glass-bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--glass-border-subtle);">
              <div style="font-weight:700; font-size:1rem; color:var(--dark-navy);">${a.childName} • ${a.vaccineName}</div>
              <div class="text-xs" style="color:var(--text-muted); margin-top:3px;">Parent: ${a.parentName} (${a.parentPhone}) • Scheduled: ${formatDate(a.appointmentDate)} at ${a.appointmentTime}</div>
            </div>

            <!-- Radio Selection: Vaccinated vs Not Vaccinated -->
            <label class="form-label">Clinical Administration Outcome <span class="required-star">*</span></label>
            <div class="vaccine-status-radio-group">
              <label class="status-radio-card selected-success" id="radio-label-vaccinated">
                <input type="radio" name="vaccine_outcome" value="Vaccinated" checked style="accent-color: var(--accent-emerald);">
                <div>
                  <strong style="color:var(--status-success-text); display:block; font-size:0.9rem;">Vaccinated / Completed</strong>
                  <span class="text-xs" style="color:var(--text-muted);">Dose administered successfully</span>
                </div>
              </label>

              <label class="status-radio-card" id="radio-label-not-vaccinated">
                <input type="radio" name="vaccine_outcome" value="Not Vaccinated" style="accent-color: var(--accent-rose);">
                <div>
                  <strong style="color:var(--accent-rose); display:block; font-size:0.9rem;">Not Vaccinated</strong>
                  <span class="text-xs" style="color:var(--text-muted);">Patient missed, delayed, or unwell</span>
                </div>
              </label>
            </div>

            <!-- Vaccinated Specific Fields (Batch #) -->
            <div id="vaccinated-fields-box">
              <div class="form-group">
                <label class="form-label" for="status-batch-num">Vaccine Batch / Lot Number <span class="required-star">*</span></label>
                <input type="text" id="status-batch-num" class="form-control" value="LOT-2026-${Math.floor(1000 + Math.random() * 9000)}" placeholder="e.g. LOT-5510-PK">
              </div>
              <div class="form-group">
                <label class="form-label" for="status-nurse-notes">Doctor / Nurse Administration Notes</label>
                <input type="text" id="status-nurse-notes" class="form-control" value="Administered via intramuscular injection, observed 20 mins." placeholder="Notes on injection site or dosage...">
              </div>
            </div>

            <!-- Not Vaccinated Specific Fields -->
            <div id="not-vaccinated-fields-box" style="display:none;">
              <div class="form-group">
                <label class="form-label" for="status-missed-reason">Reason for Non-Administration <span class="required-star">*</span></label>
                <select id="status-missed-reason" class="form-control">
                  <option value="Child had acute high fever or contraindication">Child had acute high fever or contraindication</option>
                  <option value="Patient did not attend scheduled appointment">Patient did not attend scheduled appointment</option>
                  <option value="Temporary hospital cold-chain stock shortage">Temporary hospital cold-chain stock shortage</option>
                  <option value="Parent requested reschedule due to travel">Parent requested reschedule due to travel</option>
                </select>
              </div>
            </div>
          `,
          footerHtml: `
            <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
            <button class="btn btn-primary btn-sm" id="confirm-status-update-btn">Confirm Clinical Status</button>
          `
        });

        // Setup radio change interactions
        const radioVaccinated = document.querySelector('input[value="Vaccinated"]');
        const radioNotVaccinated = document.querySelector('input[value="Not Vaccinated"]');
        const boxVaccinated = document.getElementById("vaccinated-fields-box");
        const boxNotVaccinated = document.getElementById("not-vaccinated-fields-box");
        const labelVaccinated = document.getElementById("radio-label-vaccinated");
        const labelNotVaccinated = document.getElementById("radio-label-not-vaccinated");

        if (radioVaccinated && radioNotVaccinated) {
          radioVaccinated.addEventListener("change", () => {
            boxVaccinated.style.display = "block";
            boxNotVaccinated.style.display = "none";
            labelVaccinated.className = "status-radio-card selected-success";
            labelNotVaccinated.className = "status-radio-card";
          });

          radioNotVaccinated.addEventListener("change", () => {
            boxVaccinated.style.display = "none";
            boxNotVaccinated.style.display = "block";
            labelVaccinated.className = "status-radio-card";
            labelNotVaccinated.className = "status-radio-card selected-danger";
          });
        }

        // Confirm button
        document.getElementById("confirm-status-update-btn").addEventListener("click", () => {
          const isVaccinated = radioVaccinated.checked;

          if (isVaccinated) {
            const batch = document.getElementById("status-batch-num").value;
            const notes = document.getElementById("status-nurse-notes").value;
            vaccinationService.markAsVaccinated(id, {
              batchNumber: batch || "LOT-2026-DEFAULT",
              notes
            });
            notificationService.showToast(`Updated! ${a.childName} marked as Vaccinated. Child ledger updated.`, "success");
          } else {
            const reason = document.getElementById("status-missed-reason").value;
            vaccinationService.markAsNotVaccinated(id, { reason });
            notificationService.showToast(`Updated! ${a.childName} marked as Not Vaccinated.`, "warning");
          }

          modal.close();
          refreshList();
        });
      });
    });
  }

  attachUpdateModalListeners();
}
