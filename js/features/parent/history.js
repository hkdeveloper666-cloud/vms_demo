/**
 * Parent Feature - Report of Vaccination Taken
 * Digital immunization record card and printable immunization passport
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { childService } from "../../services/ChildService.js";
import { reportService } from "../../services/ReportService.js";
import { appState } from "../../core/state.js";

export function renderParentHistoryView() {
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";
  const children = childService.getChildrenByParent(parentId);

  const childOpts = children
    .map(c => `<option value="${c.id}">${c.name} (${c.gender})</option>`)
    .join("");

  return `
    <div class="app-shell">
      ${renderSidebar("history")}

      <div class="app-main-layout">
        ${renderNavbar("Report of Vaccination Taken", ["Parent", "Medical Records", "Immunization Passport"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Child Immunization Passport & Records</h1>
              <p class="page-header-subtitle">Official verified ledger of all administered pediatric vaccines with hospital batch tracking</p>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-primary" onclick="window.print()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print Official Card
              </button>
            </div>
          </div>

          <!-- Child Selector Bar -->
          ${
            children.length > 0
              ? `
            <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem; display:flex; align-items:center; gap: 1rem; flex-wrap:wrap;">
              <span class="text-sm font-semibold">Select Child:</span>
              <select id="parent-history-child-select" class="form-control" style="max-width: 280px;">
                ${childOpts}
              </select>
            </div>
          `
              : ""
          }

          <!-- Printable Passport Paper Output -->
          <div id="parent-passport-output">
            <!-- Rendered via JS -->
          </div>
        </main>
      </div>
    </div>
  `;
}

export function attachParentHistoryEvents() {
  attachNavbarEvents();

  const select = document.getElementById("parent-history-child-select");
  const output = document.getElementById("parent-passport-output");

  function loadPassport() {
    if (select && select.value && output) {
      output.innerHTML = reportService.generatePrintablePassport(select.value);
    } else if (output) {
      output.innerHTML = `<div class="glass-card" style="padding:3rem; text-align:center;"><p>No child registered to show vaccination records for.</p></div>`;
    }
  }

  loadPassport();

  if (select) {
    select.addEventListener("change", loadPassport);
  }
}
