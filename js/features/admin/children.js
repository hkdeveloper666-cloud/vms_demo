/**
 * Admin Feature - All Child Details
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { childService } from "../../services/ChildService.js";
import { modal } from "../../components/Modal.js";
import { formatDate, calculateAge } from "../../utils/dateUtils.js";
import { formatStatusBadge } from "../../utils/formatters.js";

export function renderAdminChildrenView() {
  const children = childService.getAllChildren();

  return `
    <div class="app-shell">
      ${renderSidebar("children")}

      <div class="app-main-layout">
        ${renderNavbar("All Child Details", ["Admin", "Registry", "Child Details"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">National Child Immunization Registry</h1>
              <p class="page-header-subtitle">Comprehensive child profiles, parent contacts, and vaccination milestone statuses</p>
            </div>
          </div>

          <!-- Filter Toolbar -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; flex:1;">
                <!-- Search Input -->
                <div style="position:relative; min-width: 260px;">
                  <input type="text" id="child-search-input" class="form-control" placeholder="Search by child or parent name...">
                </div>

                <!-- Gender Filter -->
                <select id="child-gender-filter" class="form-control" style="width: 150px;">
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <!-- Status Filter -->
                <select id="child-status-filter" class="form-control" style="width: 180px;">
                  <option value="all">All Statuses</option>
                  <option value="Partially Vaccinated">Partially Vaccinated</option>
                  <option value="Fully Vaccinated">Fully Vaccinated</option>
                </select>
              </div>

              <div class="text-sm font-semibold" style="color:var(--text-muted);" id="child-count-indicator">
                Showing ${children.length} Registered Children
              </div>
            </div>
          </div>

          <!-- Table Container -->
          <div class="glass-card" id="children-table-container">
            ${renderChildrenTable(children)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderChildrenTable(children) {
  if (children.length === 0) {
    return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No child records match your criteria.</div>`;
  }

  const rowsHtml = children
    .map(
      c => `
      <tr>
        <td>
          <div class="table-avatar-cell">
            <div class="table-avatar" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color:#FFF;">
              ${c.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style="font-weight:700; color:var(--dark-navy);">${c.name}</div>
              <div class="text-xs" style="color:var(--text-muted);">${c.gender} • Blood ${c.bloodGroup}</div>
            </div>
          </div>
        </td>
        <td>
          <div>${formatDate(c.dob)}</div>
          <div class="text-xs" style="color:var(--primary); font-weight:600;">Age: ${calculateAge(c.dob)}</div>
        </td>
        <td>
          <div style="font-weight:600;">${c.parentName}</div>
          <div class="text-xs" style="color:var(--text-muted);">${c.parentRelation} • ${c.parentPhone}</div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap: 8px;">
            <div class="vaccine-progress-bar" style="width: 90px; height: 6px;">
              <div class="vaccine-progress-fill" style="width: ${(c.completedDoses / c.totalRequiredDoses) * 100}%;"></div>
            </div>
            <span class="text-xs font-semibold">${c.completedDoses}/${c.totalRequiredDoses}</span>
          </div>
        </td>
        <td>
          <span class="glass-pill ${c.status === "Fully Vaccinated" ? "glass-pill-success" : "glass-pill-primary"}">
            ${c.status}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm view-child-btn" data-child-id="${c.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            View Profile
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
            <th>Child Info</th>
            <th>Date of Birth</th>
            <th>Parent / Contact</th>
            <th>Dose Progress</th>
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

export function attachAdminChildrenEvents() {
  attachNavbarEvents();

  const searchInput = document.getElementById("child-search-input");
  const genderFilter = document.getElementById("child-gender-filter");
  const statusFilter = document.getElementById("child-status-filter");
  const tableContainer = document.getElementById("children-table-container");
  const countIndicator = document.getElementById("child-count-indicator");

  function updateTable() {
    const search = searchInput.value;
    const gender = genderFilter.value;
    const status = statusFilter.value;

    const filtered = childService.filterChildren({ search, gender, status });
    tableContainer.innerHTML = renderChildrenTable(filtered);
    if (countIndicator) {
      countIndicator.textContent = `Showing ${filtered.length} Registered Children`;
    }
    attachProfileViewButtons();
  }

  if (searchInput) searchInput.addEventListener("input", updateTable);
  if (genderFilter) genderFilter.addEventListener("change", updateTable);
  if (statusFilter) statusFilter.addEventListener("change", updateTable);

  function attachProfileViewButtons() {
    document.querySelectorAll(".view-child-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const childId = btn.getAttribute("data-child-id");
        const child = childService.getChildById(childId);
        if (!child) return;

        modal.open({
          title: `Child Profile — ${child.name}`,
          size: "lg",
          bodyHtml: `
            <div style="display:flex; align-items:center; gap: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--glass-border-subtle);">
              <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--secondary)); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:800;">
                ${child.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style="margin:0 0 4px; font-size:1.4rem;">${child.name}</h3>
                <div style="color:var(--text-muted); font-size:0.85rem;">
                  Registry ID: <code>${child.id}</code> • Registered on ${formatDate(child.createdAt || child.dob)}
                </div>
              </div>
            </div>

            <div class="report-meta-grid" style="margin-bottom: 1.5rem;">
              <div class="report-meta-item">
                <strong>Date of Birth</strong>
                <span>${formatDate(child.dob)} (${calculateAge(child.dob)})</span>
              </div>
              <div class="report-meta-item">
                <strong>Gender</strong>
                <span>${child.gender}</span>
              </div>
              <div class="report-meta-item">
                <strong>Blood Group</strong>
                <span>${child.bloodGroup}</span>
              </div>
              <div class="report-meta-item">
                <strong>Parent / Guardian</strong>
                <span>${child.parentName} (${child.parentRelation})</span>
              </div>
              <div class="report-meta-item">
                <strong>Contact Phone</strong>
                <span>${child.parentPhone}</span>
              </div>
              <div class="report-meta-item">
                <strong>Emergency Hotline</strong>
                <span>${child.emergencyContact}</span>
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <h4 style="font-size:1rem; margin-bottom: 0.5rem;">Clinical Notes & Allergies</h4>
              <p class="text-sm" style="background:var(--glass-bg-subtle); padding: 0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--glass-border-subtle);">
                <strong>Allergies:</strong> ${child.allergies || "None declared."}<br>
                <strong>Pediatrician Notes:</strong> ${child.notes || "Healthy developmental metrics."}
              </p>
            </div>

            <div style="margin-bottom: 1rem;">
              <h4 style="font-size:1rem; margin-bottom: 0.5rem;">Immunization Milestones (${child.completedDoses} / ${child.totalRequiredDoses} Complete)</h4>
              <div class="vaccine-progress-bar" style="height: 10px; margin-bottom: 0.5rem;">
                <div class="vaccine-progress-fill" style="width: ${(child.completedDoses / child.totalRequiredDoses) * 100}%;"></div>
              </div>
            </div>
          `,
          footerHtml: `
            <a href="#admin/reports" class="btn btn-secondary btn-sm" onclick="modal.close()">View Full Medical Report</a>
            <button class="btn btn-primary btn-sm" onclick="modal.close()">Close Window</button>
          `
        });
      });
    });
  }

  attachProfileViewButtons();
}
