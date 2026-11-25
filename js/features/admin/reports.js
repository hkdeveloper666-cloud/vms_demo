/**
 * Admin Feature - Report of Vaccination
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { reportService } from "../../services/ReportService.js";
import { childService } from "../../services/ChildService.js";
import { modal } from "../../components/Modal.js";

export function renderAdminReportsView() {
  const children = childService.getAllChildren();

  const childOptions = children
    .map(c => `<option value="${c.id}">${c.name} (Parent: ${c.parentName})</option>`)
    .join("");

  return `
    <div class="app-shell">
      ${renderSidebar("reports")}

      <div class="app-main-layout">
        ${renderNavbar("Report of Vaccination", ["Admin", "Clinical Reports"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Vaccination Reports & Clinical Ledgers</h1>
              <p class="page-header-subtitle">Generate child-wise, date-wise reports, and certified immunization passports</p>
            </div>
          </div>

          <!-- Report Mode Tabs -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div class="auth-role-tabs" style="margin-bottom:0; max-width: 380px;">
                <button type="button" class="auth-role-tab active" id="tab-child-report">Child-wise Report</button>
                <button type="button" class="auth-role-tab" id="tab-date-report">Date-wise Report</button>
              </div>

              <!-- Action buttons -->
              <div style="display:flex; gap: 0.75rem;">
                <button class="btn btn-secondary btn-sm" id="print-current-report-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Print Report
                </button>
              </div>
            </div>

            <!-- Controls: Child-Wise -->
            <div id="controls-child-report" style="margin-top: 1.25rem; display:flex; align-items:center; gap: 1rem; flex-wrap:wrap;">
              <label for="select-child-report" class="text-sm font-semibold">Select Child:</label>
              <select id="select-child-report" class="form-control" style="max-width: 320px;">
                ${childOptions}
              </select>
              <button class="btn btn-primary btn-sm" id="btn-generate-child-report">Generate Child Ledger</button>
            </div>

            <!-- Controls: Date-Wise -->
            <div id="controls-date-report" style="margin-top: 1.25rem; display:none; align-items:center; gap: 1rem; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap: 8px;">
                <label for="date-start-report" class="text-sm font-semibold">From:</label>
                <input type="date" id="date-start-report" class="form-control" style="width: 170px;">
              </div>
              <div style="display:flex; align-items:center; gap: 8px;">
                <label for="date-end-report" class="text-sm font-semibold">To:</label>
                <input type="date" id="date-end-report" class="form-control" style="width: 170px;">
              </div>
              <button class="btn btn-primary btn-sm" id="btn-generate-date-report">Filter Period</button>
            </div>
          </div>

          <!-- Printable Report Output Display Area -->
          <div id="report-output-container">
            <!-- Rendered via JS -->
          </div>
        </main>
      </div>
    </div>
  `;
}

export function attachAdminReportsEvents() {
  attachNavbarEvents();

  const tabChild = document.getElementById("tab-child-report");
  const tabDate = document.getElementById("tab-date-report");
  const controlsChild = document.getElementById("controls-child-report");
  const controlsDate = document.getElementById("controls-date-report");
  const childSelect = document.getElementById("select-child-report");
  const btnChild = document.getElementById("btn-generate-child-report");
  const btnDate = document.getElementById("btn-generate-date-report");
  const printBtn = document.getElementById("print-current-report-btn");
  const outputContainer = document.getElementById("report-output-container");

  // Initial load with first child
  if (childSelect && childSelect.value) {
    outputContainer.innerHTML = reportService.generatePrintablePassport(childSelect.value);
  }

  // Tab switching
  if (tabChild && tabDate) {
    tabChild.addEventListener("click", () => {
      tabChild.classList.add("active");
      tabDate.classList.remove("active");
      controlsChild.style.display = "flex";
      controlsDate.style.display = "none";
      if (childSelect && childSelect.value) {
        outputContainer.innerHTML = reportService.generatePrintablePassport(childSelect.value);
      }
    });

    tabDate.addEventListener("click", () => {
      tabDate.classList.add("active");
      tabChild.classList.remove("active");
      controlsChild.style.display = "none";
      controlsDate.style.display = "flex";
      loadDateWiseReport();
    });
  }

  if (btnChild && childSelect) {
    btnChild.addEventListener("click", () => {
      outputContainer.innerHTML = reportService.generatePrintablePassport(childSelect.value);
    });
  }

  if (btnDate) {
    btnDate.addEventListener("click", loadDateWiseReport);
  }

  function loadDateWiseReport() {
    const startDate = document.getElementById("date-start-report").value;
    const endDate = document.getElementById("date-end-report").value;
    const report = reportService.getDateWiseReport(startDate, endDate);

    const rowsHtml = report.records
      .map(
        (r, i) => `
        <tr>
          <td>#${i + 1}</td>
          <td><strong>${r.childName}</strong> <div class="text-xs" style="color:var(--text-muted);">${r.parentName}</div></td>
          <td>${r.vaccineName}</td>
          <td>${r.hospitalName}</td>
          <td>${r.appointmentDate}</td>
          <td>${r.batchNumber || "—"}</td>
          <td><span class="glass-pill glass-pill-primary">${r.status}</span></td>
        </tr>
      `
      )
      .join("");

    outputContainer.innerHTML = `
      <div class="report-paper">
        <div class="report-header">
          <div>
            <h2 style="font-size:22px; color:#17233D; margin:0;">DATE-WISE IMMUNIZATION RECONCILIATION</h2>
            <p style="margin:4px 0 0; color:#64748B; font-size:13px;">Period Coverage: ${startDate || "All Historic"} to ${endDate || "Present"}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px; color:#64748B;">Total Records: <strong>${report.totalCount}</strong></div>
            <div style="font-size:12px; color:#059669;">Completed Doses: <strong>${report.totalVaccinated}</strong></div>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:#F8FAFC; text-align:left; font-size:11px; text-transform:uppercase; color:#64748B;">
              <th style="padding:10px;">#</th>
              <th style="padding:10px;">Child & Parent</th>
              <th style="padding:10px;">Vaccine</th>
              <th style="padding:10px;">Hospital</th>
              <th style="padding:10px;">Scheduled Date</th>
              <th style="padding:10px;">Batch #</th>
              <th style="padding:10px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="7" style="padding:2rem; text-align:center;">No records in selected period.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
