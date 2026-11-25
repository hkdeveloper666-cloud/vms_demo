/**
 * Parent Feature - Vaccination Dates & Schedules
 * Timeline of child immunization milestones, upcoming dates, and reminders
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { childService } from "../../services/ChildService.js";
import { vaccineService } from "../../services/VaccineService.js";
import { bookingService } from "../../services/BookingService.js";
import { appState } from "../../core/state.js";
import { formatDate } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderParentScheduleView() {
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";
  const children = childService.getChildrenByParent(parentId);
  const vaccines = vaccineService.getAllVaccines();
  const myBookings = bookingService.getBookingsByParent(parentId);

  const selectedChild = children[0] || null;

  return `
    <div class="app-shell">
      ${renderSidebar("schedule")}

      <div class="app-main-layout">
        ${renderNavbar("Vaccination Dates", ["Parent", "Immunization Timeline"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Immunization Schedule & Milestones</h1>
              <p class="page-header-subtitle">Official EPI schedule timeline, upcoming vaccination alerts, and completed doses</p>
            </div>
            <div class="page-header-actions">
              <a href="#parent/book" class="btn btn-primary">
                Book Next Vaccine Slot
              </a>
            </div>
          </div>

          <!-- Child Selector Dropdown -->
          ${
            children.length > 0
              ? `
            <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1rem 1.5rem; display:flex; align-items:center; gap: 1rem; flex-wrap:wrap;">
              <span class="text-sm font-semibold">Viewing Schedule For:</span>
              <select id="parent-child-schedule-select" class="form-control" style="max-width: 260px;">
                ${children.map(c => `<option value="${c.id}">${c.name} (${c.gender})</option>`).join("")}
              </select>
            </div>
          `
              : ""
          }

          <!-- Timeline Container -->
          <div class="glass-card" id="schedule-timeline-container">
            ${renderTimeline(selectedChild, vaccines, myBookings)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderTimeline(child, vaccines, bookings) {
  if (!child) {
    return `<div style="padding:3rem; text-align:center; color:var(--text-muted);">Please add a child first to view their personalized schedule.</div>`;
  }

  const timelineItemsHtml = vaccines
    .map(v => {
      // Check if child has a booking for this vaccine
      const match = bookings.find(b => b.childId === child.id && (b.vaccineId === v.id || b.vaccineName.includes(v.code)));
      const isCompleted = match && match.status === "Vaccinated";
      const isPending = match && (match.status === "Pending" || match.status === "Approved");

      let itemClass = "pending";
      let statusText = "Due at Milestone";
      if (isCompleted) {
        itemClass = "completed";
        statusText = `Administered on ${formatDate(match.appointmentDate)}`;
      } else if (isPending) {
        itemClass = "pending";
        statusText = `Scheduled: ${formatDate(match.appointmentDate)} (${match.status})`;
      }

      return `
        <div class="timeline-item ${itemClass}">
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 6px;">
              <div>
                <strong style="font-size:1rem; color:var(--dark-navy);">${v.name}</strong>
                <div class="text-xs" style="color:var(--primary); font-weight:700;">Recommended Age: ${v.recommendedAge}</div>
              </div>
              <span class="glass-pill ${isCompleted ? "glass-pill-success" : isPending ? "glass-pill-warning" : "glass-pill-primary"}">
                ${isCompleted ? "Completed" : isPending ? match.status : "Upcoming"}
              </span>
            </div>

            <p class="text-sm" style="margin-bottom:0.6rem;">${v.description}</p>
            <div class="text-xs" style="color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
              <span>Target: ${v.targetDisease}</span>
              ${
                !isCompleted && !isPending
                  ? `<a href="#parent/book" class="btn btn-primary btn-sm" style="font-size:0.75rem; padding: 3px 10px;">Book This Slot</a>`
                  : `<span style="font-weight:600; color:var(--dark-navy);">${statusText}</span>`
              }
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="margin-bottom:1.25rem;">
      <h3 style="font-size:1.2rem; color:var(--dark-navy); margin-bottom:4px;">${child.name}'s Recommended Vaccine Journey</h3>
      <p class="text-sm">Expanded Programme on Immunization (EPI) guidelines tracking</p>
    </div>
    <div class="timeline-list">
      ${timelineItemsHtml}
    </div>
  `;
}

export function attachParentScheduleEvents() {
  attachNavbarEvents();

  const childSelect = document.getElementById("parent-child-schedule-select");
  const container = document.getElementById("schedule-timeline-container");
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";

  if (childSelect) {
    childSelect.addEventListener("change", () => {
      const childId = childSelect.value;
      const child = childService.getChildById(childId);
      const vaccines = vaccineService.getAllVaccines();
      const bookings = bookingService.getBookingsByParent(parentId);
      container.innerHTML = renderTimeline(child, vaccines, bookings);
    });
  }
}
