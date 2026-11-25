/**
 * Admin Feature - Main Dashboard
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { renderStatCard, animateCounters } from "../../components/StatCard.js";
import { adminService } from "../../services/AdminService.js";
import { bookingService } from "../../services/BookingService.js";
import { childService } from "../../services/ChildService.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderAdminDashboard() {
  const stats = adminService.getDashboardStats();
  const recentBookings = bookingService.getAllBookings().slice(0, 6);
  const upcomingSchedules = bookingService
    .getAllBookings()
    .filter(b => b.status === "Approved")
    .slice(0, 5);

  const bookingsRowsHtml = recentBookings
    .map(
      b => `
      <tr>
        <td><strong>${b.bookingId}</strong></td>
        <td>
          <div class="table-avatar-cell">
            <div class="table-avatar">${b.childName.substring(0, 2).toUpperCase()}</div>
            <div>
              <div style="font-weight:700;">${b.childName}</div>
              <div class="text-xs" style="color:var(--text-muted);">${b.parentName}</div>
            </div>
          </div>
        </td>
        <td>${b.vaccineName}</td>
        <td>${b.hospitalName}</td>
        <td>${formatDate(b.appointmentDate)} <span class="text-xs">(${b.appointmentTime})</span></td>
        <td>${formatStatusBadge(b.status)}</td>
      </tr>
    `
    )
    .join("");

  const scheduleItemsHtml = upcomingSchedules
    .map(
      s => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--glass-border-subtle);">
        <div style="display:flex; align-items:center; gap: 0.75rem;">
          <div style="width:40px; height:40px; border-radius:var(--radius-sm); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:700;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <div style="font-weight:700; font-size:0.9rem; color:var(--dark-navy);">${s.childName} • ${s.vaccineName}</div>
            <div class="text-xs" style="color:var(--text-muted);">${s.hospitalName}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; font-size:0.85rem; color:var(--primary);">${formatDate(s.appointmentDate)}</div>
          <div class="text-xs" style="color:var(--text-muted);">${s.appointmentTime}</div>
        </div>
      </div>
    `
    )
    .join("");

  return `
    <div class="app-shell">
      ${renderSidebar("dashboard")}

      <div class="app-main-layout">
        ${renderNavbar("Admin Dashboard", ["VAXORA Admin", "Surveillance Control"])}

        <main class="app-content animate-fade-in">
          <!-- Page Header -->
          <div class="page-header">
            <div>
              <h1 class="page-header-title">National Immunization Command</h1>
              <p class="page-header-subtitle">Real-time surveillance, provider capacity, and pediatric vaccination records</p>
            </div>
            <div class="page-header-actions">
              <a href="#admin/requests" class="btn btn-lavender">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                Review Requests (${stats.pendingRequests})
              </a>
              <a href="#admin/hospitals" class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Manage Hospitals
              </a>
            </div>
          </div>

          <!-- 7 Admin Statistics Cards as Requested -->
          <div class="grid-stats-4">
            ${renderStatCard({
              title: "Total Registered Children",
              value: stats.totalChildren,
              icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>`,
              subtext: "EPI Registered Registry",
              colorScheme: "primary"
            })}
            ${renderStatCard({
              title: "Approved Hospitals",
              value: stats.totalHospitals,
              icon: `<path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 9h6"></path><path d="M9 13h6"></path>`,
              subtext: "Cold-chain Certified",
              colorScheme: "lavender"
            })}
            ${renderStatCard({
              title: "Available Vaccines",
              value: stats.availableVaccines,
              icon: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>`,
              subtext: `${stats.totalVaccines} Formulations cataloged`,
              colorScheme: "emerald"
            })}
            ${renderStatCard({
              title: "Pending Requests",
              value: stats.pendingRequests,
              icon: `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`,
              subtext: "Action required",
              colorScheme: "amber"
            })}
          </div>

          <div class="grid-stats-3">
            ${renderStatCard({
              title: "Total Bookings",
              value: stats.totalBookings,
              icon: `<path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>`,
              subtext: "Parent appointment submissions",
              colorScheme: "primary"
            })}
            ${renderStatCard({
              title: "Completed Vaccinations",
              value: stats.completedVaccinations,
              icon: `<polyline points="20 6 9 17 4 12"></polyline>`,
              subtext: "Clinically validated doses",
              colorScheme: "emerald"
            })}
            ${renderStatCard({
              title: "Upcoming Vaccinations",
              value: stats.upcomingVaccinations,
              icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>`,
              subtext: "Approved & scheduled",
              colorScheme: "lavender"
            })}
          </div>

          <!-- Middle Analytics & Upcoming Schedules Grid -->
          <div class="grid-two-column">
            <!-- Vaccination Analytics Chart -->
            <div class="glass-card">
              <div class="panel-header">
                <h3 class="panel-title">Vaccination Distribution Analytics</h3>
                <span class="glass-pill glass-pill-primary">Monthly Overview</span>
              </div>
              <div class="chart-container">
                <canvas id="admin-analytics-chart"></canvas>
              </div>
            </div>

            <!-- Upcoming Schedules Side List -->
            <div class="glass-card">
              <div class="panel-header">
                <h3 class="panel-title">Upcoming Schedule</h3>
                <a href="#admin/schedule" class="text-sm font-semibold" style="color:var(--primary);">View All</a>
              </div>
              <div>
                ${scheduleItemsHtml || '<div style="padding:2rem 0; text-align:center; color:var(--text-muted);">No upcoming appointments scheduled.</div>'}
              </div>
            </div>
          </div>

          <!-- Recent Bookings Table -->
          <div class="glass-card">
            <div class="panel-header">
              <h3 class="panel-title">Recent Appointment Bookings</h3>
              <a href="#admin/bookings" class="btn btn-secondary btn-sm">View Full Register</a>
            </div>
            <div class="table-responsive">
              <table class="glass-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Child & Parent</th>
                    <th>Vaccine</th>
                    <th>Hospital</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${bookingsRowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

export function attachAdminDashboardEvents() {
  attachNavbarEvents();
  animateCounters();

  // Render Chart.js analytics chart
  const canvas = document.getElementById("admin-analytics-chart");
  if (canvas && typeof Chart !== "undefined") {
    const analytics = adminService.getAnalyticsData();

    new Chart(canvas, {
      type: "line",
      data: {
        labels: analytics.labels,
        datasets: [
          {
            label: "Doses Administered",
            data: analytics.vaccinatedCounts,
            borderColor: "#5B8DEF",
            backgroundColor: "rgba(91, 141, 239, 0.15)",
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: "Pending Requests",
            data: analytics.pendingCounts,
            borderColor: "#A78BFA",
            backgroundColor: "rgba(167, 139, 250, 0.08)",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { font: { family: "Inter", size: 12 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(226, 232, 240, 0.4)" }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}
