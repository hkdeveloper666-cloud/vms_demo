/**
 * Parent Feature - Dashboard
 * Reference image styling with glass cards, quick action pills, child profiles, and next dose reminders
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { renderStatCard, animateCounters } from "../../components/StatCard.js";
import { appState } from "../../core/state.js";
import { parentService } from "../../services/ParentService.js";
import { formatDate, calculateAge } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderParentDashboard() {
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";
  const stats = parentService.getParentDashboardStats(parentId);
  const nextReminder = parentService.getNextUpcomingReminder(parentId);

  // Child profile cards html
  const childrenCardsHtml = stats.children
    .map(
      c => `
      <div class="child-profile-card">
        <div>
          <div class="child-avatar-row">
            <div class="child-avatar-circle">${c.name.substring(0, 2).toUpperCase()}</div>
            <div>
              <div class="child-card-name">${c.name}</div>
              <div class="child-card-dob">DOB: ${formatDate(c.dob)} (${calculateAge(c.dob)})</div>
              <span class="glass-pill ${c.status === "Fully Vaccinated" ? "glass-pill-success" : "glass-pill-primary"}" style="font-size:0.7rem; margin-top:4px;">
                ${c.status}
              </span>
            </div>
          </div>

          <div class="vaccine-progress-wrapper">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:600; margin-bottom:4px;">
              <span>Immunization Progress</span>
              <span>${c.completedDoses} / ${c.totalRequiredDoses} Doses</span>
            </div>
            <div class="vaccine-progress-bar">
              <div class="vaccine-progress-fill" style="width: ${(c.completedDoses / c.totalRequiredDoses) * 100}%;"></div>
            </div>
          </div>

          <div style="font-size:0.8rem; color:var(--text-muted); background:var(--glass-bg-subtle); padding:0.6rem; border-radius:var(--radius-sm); margin-bottom:0.75rem;">
            <strong>Blood Group:</strong> ${c.bloodGroup} • <strong>Allergies:</strong> ${c.allergies || "None"}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; pt: 0.5rem; border-top:1px solid var(--glass-border-subtle);">
          <a href="#parent/history" class="btn btn-secondary btn-sm" style="flex:1; margin-right:6px;">View History</a>
          <a href="#parent/book" class="btn btn-primary btn-sm" style="flex:1;">Book Slot</a>
        </div>
      </div>
    `
    )
    .join("");

  // Recent booking rows
  const recentBookingsRows = stats.recentBookings
    .map(
      b => `
      <tr>
        <td><strong>${b.childName}</strong></td>
        <td>${b.vaccineName}</td>
        <td>${b.hospitalName}</td>
        <td>${formatDate(b.appointmentDate)} (${b.appointmentTime})</td>
        <td>${formatStatusBadge(b.status)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="app-shell">
      ${renderSidebar("dashboard")}

      <div class="app-main-layout">
        ${renderNavbar("Parent Dashboard", ["VAXORA", "Parent Portal", "Family Immunization"])}

        <main class="app-content animate-fade-in">
          <!-- macOS Glass Welcome Banner (Matches Reference Image) -->
          <div class="welcome-hero-card">
            <div class="welcome-hero-text">
              <div class="macos-traffic-lights" style="margin-bottom:0.5rem;">
                <span class="macos-dot macos-dot-close"></span>
                <span class="macos-dot macos-dot-min"></span>
                <span class="macos-dot macos-dot-zoom"></span>
              </div>
              <h2>Welcome back, ${user?.name || "Parent"}!</h2>
              <p>
                Keep your children protected with timely WHO and EPI compliant vaccination schedules. Track digital immunization records and book certified hospital clinics.
              </p>
              ${
                nextReminder
                  ? `
                <div class="welcome-hero-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Next Appointment: <strong>${nextReminder.vaccineName}</strong> for <strong>${nextReminder.childName}</strong> on <strong>${formatDate(nextReminder.appointmentDate)} (${nextReminder.appointmentTime})</strong>
                </div>
              `
                  : `
                <div class="welcome-hero-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  All scheduled vaccines up to date. Ready to schedule next milestone?
                </div>
              `
              }
            </div>

            <!-- Decorative Visual Right -->
            <div style="flex-shrink:0; display:none; @media(min-width:768px){display:block;}">
              <div style="width:110px; height:110px; border-radius:50%; background:linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 12px 30px var(--primary-glow); color:#FFF; font-size:2.5rem;">
                🛡️
              </div>
            </div>
          </div>

          <!-- Quick Actions Circle Row (Matches Reference Image) -->
          <div class="quick-action-row">
            <a href="#parent/book" class="quick-action-btn">
              <div class="quick-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <span class="quick-action-label">Book Slot</span>
            </a>

            <a href="#parent/children" class="quick-action-btn">
              <div class="quick-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </div>
              <span class="quick-action-label">Add Child</span>
            </a>

            <a href="#parent/schedule" class="quick-action-btn">
              <div class="quick-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <span class="quick-action-label">Schedules</span>
            </a>

            <a href="#parent/requests" class="quick-action-btn">
              <div class="quick-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </div>
              <span class="quick-action-label">Track Status</span>
            </a>

            <a href="#parent/history" class="quick-action-btn">
              <div class="quick-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              </div>
              <span class="quick-action-label">Passport</span>
            </a>
          </div>

          <!-- 4 Statistics Cards -->
          <div class="grid-stats-4">
            ${renderStatCard({
              title: "Registered Children",
              value: stats.totalChildren,
              icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>`,
              subtext: "Family Profiles",
              colorScheme: "primary"
            })}
            ${renderStatCard({
              title: "Upcoming Vaccinations",
              value: stats.upcomingVaccinations,
              icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>`,
              subtext: "Approved & Scheduled",
              colorScheme: "lavender"
            })}
            ${renderStatCard({
              title: "Completed Vaccinations",
              value: stats.completedVaccinations,
              icon: `<polyline points="20 6 9 17 4 12"></polyline>`,
              subtext: "Doses Given",
              colorScheme: "emerald"
            })}
            ${renderStatCard({
              title: "Pending Appointments",
              value: stats.pendingAppointments,
              icon: `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`,
              subtext: "Awaiting Admin Approval",
              colorScheme: "amber"
            })}
          </div>

          <!-- Children Profiles Grid Section -->
          <div class="panel-header" style="margin-top: 1.5rem;">
            <h3 class="panel-title">My Registered Children</h3>
            <a href="#parent/children" class="btn btn-secondary btn-sm">+ Add Child</a>
          </div>
          <div class="grid-cards-3" style="margin-bottom: 2rem;">
            ${childrenCardsHtml || `<div class="glass-card" style="grid-column:1/-1; text-align:center; padding:2rem;"><p>No child registered yet. Click "+ Add Child" to begin.</p></div>`}
          </div>

          <!-- Recent Activity & Immunization History -->
          <div class="glass-card">
            <div class="panel-header">
              <h3 class="panel-title">Recent Appointment Activity</h3>
              <a href="#parent/history" class="btn btn-secondary btn-sm">Full History</a>
            </div>
            <div class="table-responsive">
              <table class="glass-table">
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Vaccine</th>
                    <th>Hospital</th>
                    <th>Appointment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentBookingsRows || `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No recent appointments.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

export function attachParentDashboardEvents() {
  attachNavbarEvents();
  animateCounters();
}
