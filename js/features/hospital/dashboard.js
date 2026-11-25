/**
 * Hospital Feature - Dashboard
 * Displays stats and queue for the logged-in hospital
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { renderStatCard, animateCounters } from "../../components/StatCard.js";
import { appState } from "../../core/state.js";
import { hospitalService } from "../../services/HospitalService.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderHospitalDashboard() {
  const user = appState.getCurrentUser();
  const hospitalId = user?.hospitalId || "hosp-1";
  const hosp = hospitalService.getHospitalById(hospitalId) || {
    name: user?.name || "Shifa International Hospital",
    city: "Islamabad",
    phone: user?.phone || "03335551234"
  };

  const stats = hospitalService.getHospitalDashboardStats(hospitalId);

  const appointmentsRowsHtml = stats.recentAppointments
    .map(
      a => `
      <tr>
        <td><strong>${a.bookingId}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--dark-navy);">${a.childName}</div>
          <div class="text-xs" style="color:var(--text-muted);">${a.parentName} (${a.parentPhone})</div>
        </td>
        <td>
          <span class="glass-pill glass-pill-primary" style="font-size:0.75rem;">${a.vaccineName}</span>
        </td>
        <td>${formatDate(a.appointmentDate)} (${a.appointmentTime})</td>
        <td>${formatStatusBadge(a.status)}</td>
        <td>
          <a href="#hospital/status" class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding: 4px 10px;">
            Update Status
          </a>
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="app-shell">
      ${renderSidebar("dashboard")}

      <div class="app-main-layout">
        ${renderNavbar("Hospital Dashboard", ["Hospital Portal", hosp.name, "Clinical Overview"])}

        <main class="app-content animate-fade-in">
          <!-- Hospital Banner -->
          <div class="welcome-hero-card">
            <div class="welcome-hero-text">
              <div class="macos-traffic-lights" style="margin-bottom:0.5rem;">
                <span class="macos-dot macos-dot-close"></span>
                <span class="macos-dot macos-dot-min"></span>
                <span class="macos-dot macos-dot-zoom"></span>
              </div>
              <h2>${hosp.name}</h2>
              <p>
                Authorized Pediatric Vaccination Center • ${hosp.city}. Receive appointments approved by Health Admin and record administered vaccine batches.
              </p>
              <div class="welcome-hero-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Active Clinic Operations: <strong>${stats.upcomingAppointments} Approved Patients Scheduled</strong>
              </div>
            </div>

            <div style="flex-shrink:0; display:none; @media(min-width:768px){display:block;}">
              <div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, #10B981, #059669); display:flex; align-items:center; justify-content:center; box-shadow:0 12px 30px rgba(16,185,129,0.3); color:#FFF; font-size:2.2rem;">
                🏥
              </div>
            </div>
          </div>

          <!-- 4 Required Hospital Stats Cards -->
          <div class="grid-stats-4">
            ${renderStatCard({
              title: "Total Appointments",
              value: stats.totalAppointments,
              icon: `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>`,
              subtext: "All-time bookings",
              colorScheme: "primary"
            })}
            ${renderStatCard({
              title: "Pending Approval",
              value: stats.pendingAppointments,
              icon: `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`,
              subtext: "At Admin Review",
              colorScheme: "amber"
            })}
            ${renderStatCard({
              title: "Upcoming Appointments",
              value: stats.upcomingAppointments,
              icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>`,
              subtext: "Approved by Admin",
              colorScheme: "lavender"
            })}
            ${renderStatCard({
              title: "Completed Vaccinations",
              value: stats.completedVaccinations,
              icon: `<polyline points="20 6 9 17 4 12"></polyline>`,
              subtext: "Vaccinated & Verified",
              colorScheme: "emerald"
            })}
          </div>

          <!-- Hospital Queue Table -->
          <div class="glass-card">
            <div class="panel-header">
              <h3 class="panel-title">Center Appointment Ledger</h3>
              <a href="#hospital/appointments" class="btn btn-secondary btn-sm">Full Queue</a>
            </div>
            <div class="table-responsive">
              <table class="glass-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Patient & Parent</th>
                    <th>Vaccine</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                    <th style="text-align:right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${appointmentsRowsHtml || `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No appointments booked for this center yet.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

export function attachHospitalDashboardEvents() {
  attachNavbarEvents();
  animateCounters();
}
