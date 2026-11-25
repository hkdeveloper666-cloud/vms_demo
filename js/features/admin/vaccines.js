/**
 * Admin Feature - List of Vaccines (CRUD & Availability Toggling)
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { vaccineService } from "../../services/VaccineService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { modal } from "../../components/Modal.js";
import { VACCINE_STATUS } from "../../core/constants.js";

export function renderAdminVaccinesView() {
  const vaccines = vaccineService.getAllVaccines();

  return `
    <div class="app-shell">
      ${renderSidebar("vaccines")}

      <div class="app-main-layout">
        ${renderNavbar("List of Vaccines", ["Admin", "Vaccine Catalog"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Vaccine Inventory & Catalog</h1>
              <p class="page-header-subtitle">Manage formulations, target age groups, dosage schedules, and national stock availability</p>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-primary" id="btn-open-add-vaccine">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Vaccine
              </button>
            </div>
          </div>

          <!-- Catalog Cards Grid -->
          <div class="grid-cards-3" id="vaccines-grid-container">
            ${renderVaccinesGrid(vaccines)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderVaccinesGrid(vaccines) {
  return vaccines
    .map(
      v => `
      <div class="glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.75rem;">
            <span class="glass-pill ${v.status === VACCINE_STATUS.AVAILABLE ? "glass-pill-success" : "glass-pill-danger"}">
              ${v.status}
            </span>
            <div class="text-xs font-semibold" style="color:var(--text-muted); background:var(--glass-bg-subtle); padding: 2px 8px; border-radius: var(--radius-xs);">
              ${v.code || "VAC"}
            </div>
          </div>

          <h3 style="font-size: 1.15rem; color:var(--dark-navy); margin-bottom: 0.4rem;">${v.name}</h3>
          <div style="font-size:0.8rem; font-weight:700; color:var(--primary); margin-bottom: 0.5rem;">
            Target: ${v.targetDisease}
          </div>

          <p class="text-sm" style="margin-bottom: 1rem; line-height:1.45;">
            ${v.description || "Standard childhood immunization formulation."}
          </p>

          <div style="background:var(--glass-bg-subtle); padding: 0.65rem 0.85rem; border-radius:var(--radius-sm); font-size:0.8rem; border:1px solid var(--glass-border-subtle); margin-bottom: 1.25rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-muted);">Recommended Age:</span>
              <strong style="color:var(--dark-navy);">${v.recommendedAge}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Required Doses:</span>
              <strong>${v.dosesRequired} Dose${v.dosesRequired > 1 ? "s" : ""}</strong>
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding-top: 0.85rem; border-top:1px solid var(--glass-border-subtle);">
          <button class="btn btn-sm ${v.status === VACCINE_STATUS.AVAILABLE ? "btn-secondary" : "btn-success"} toggle-status-btn" data-id="${v.id}">
            Mark as ${v.status === VACCINE_STATUS.AVAILABLE ? "Unavailable" : "Available"}
          </button>
          
          <div style="display:flex; gap: 0.35rem;">
            <button class="btn-icon edit-vaccine-btn" data-id="${v.id}" title="Edit Vaccine">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete-vaccine-btn" data-id="${v.id}" title="Delete Vaccine" style="color:var(--accent-rose);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

export function attachAdminVaccinesEvents() {
  attachNavbarEvents();

  const addBtn = document.getElementById("btn-open-add-vaccine");
  const gridContainer = document.getElementById("vaccines-grid-container");

  function refreshGrid() {
    const list = vaccineService.getAllVaccines();
    gridContainer.innerHTML = renderVaccinesGrid(list);
    attachCardActions();
  }

  function attachCardActions() {
    // Toggle Available / Unavailable
    document.querySelectorAll(".toggle-status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const updated = vaccineService.toggleAvailability(id);
        if (updated) {
          notificationService.showToast(`Vaccine marked as ${updated.status}`, "info");
          refreshGrid();
        }
      });
    });

    // Edit Vaccine
    document.querySelectorAll(".edit-vaccine-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const v = vaccineService.getVaccineById(id);
        if (!v) return;

        modal.open({
          title: `Edit Vaccine — ${v.name}`,
          bodyHtml: `
            <form id="edit-vaccine-form" novalidate>
              <div class="form-group">
                <label class="form-label" for="edit-vac-name">Vaccine Name <span class="required-star">*</span></label>
                <input type="text" id="edit-vac-name" name="vaccineName" class="form-control" value="${v.name}" required>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="edit-vac-code">Code Designation</label>
                  <input type="text" id="edit-vac-code" name="code" class="form-control" value="${v.code}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-vac-target">Target Disease</label>
                  <input type="text" id="edit-vac-target" name="targetDisease" class="form-control" value="${v.targetDisease}">
                </div>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="edit-vac-age">Recommended Age</label>
                  <input type="text" id="edit-vac-age" name="recommendedAge" class="form-control" value="${v.recommendedAge}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-vac-doses">Doses Required</label>
                  <input type="number" id="edit-vac-doses" name="dosesRequired" class="form-control" value="${v.dosesRequired}" min="1" max="5">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-vac-desc">Description</label>
                <textarea id="edit-vac-desc" name="description" class="form-control">${v.description}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-vac-status">Availability Status</label>
                <select id="edit-vac-status" name="status" class="form-control">
                  <option value="Available" ${v.status === "Available" ? "selected" : ""}>Available</option>
                  <option value="Unavailable" ${v.status === "Unavailable" ? "selected" : ""}>Unavailable</option>
                </select>
              </div>
            </form>
          `,
          footerHtml: `
            <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
            <button class="btn btn-primary btn-sm" id="save-edit-vaccine-btn">Save Changes</button>
          `
        });

        const editForm = document.getElementById("edit-vaccine-form");
        validationService.attachLiveValidation(editForm);

        document.getElementById("save-edit-vaccine-btn").addEventListener("click", () => {
          if (!validationService.validateForm(editForm)) return;
          const formData = new FormData(editForm);
          vaccineService.updateVaccine(id, {
            name: formData.get("vaccineName"),
            code: formData.get("code"),
            targetDisease: formData.get("targetDisease"),
            recommendedAge: formData.get("recommendedAge"),
            dosesRequired: formData.get("dosesRequired"),
            description: formData.get("description"),
            status: formData.get("status")
          });
          notificationService.showToast("Vaccine details updated successfully.", "success");
          modal.close();
          refreshGrid();
        });
      });
    });

    // Delete Vaccine
    document.querySelectorAll(".delete-vaccine-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to remove this vaccine formulation?")) {
          vaccineService.deleteVaccine(id);
          notificationService.showToast("Vaccine removed from catalog.", "warning");
          refreshGrid();
        }
      });
    });
  }

  // Open Add Vaccine Modal
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      modal.open({
        title: "Add New Vaccine Formulation",
        bodyHtml: `
          <form id="add-vaccine-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="add-vac-name">Vaccine Name <span class="required-star">*</span></label>
              <input type="text" id="add-vac-name" name="vaccineName" class="form-control" placeholder="e.g. Hepatitis B Vaccine" required>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label" for="add-vac-code">Code Designation</label>
                <input type="text" id="add-vac-code" name="code" class="form-control" placeholder="e.g. HepB">
              </div>
              <div class="form-group">
                <label class="form-label" for="add-vac-target">Target Disease</label>
                <input type="text" id="add-vac-target" name="targetDisease" class="form-control" placeholder="e.g. Hepatitis B virus">
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label" for="add-vac-age">Recommended Age</label>
                <input type="text" id="add-vac-age" name="recommendedAge" class="form-control" placeholder="e.g. 6 Weeks">
              </div>
              <div class="form-group">
                <label class="form-label" for="add-vac-doses">Doses Required</label>
                <input type="number" id="add-vac-doses" name="dosesRequired" class="form-control" value="1" min="1" max="5">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="add-vac-desc">Description</label>
              <textarea id="add-vac-desc" name="description" class="form-control" placeholder="Clinical purpose, composition, temperature storage..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="add-vac-status">Availability Status</label>
              <select id="add-vac-status" name="status" class="form-control">
                <option value="Available" selected>Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </form>
        `,
        footerHtml: `
          <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
          <button class="btn btn-primary btn-sm" id="save-new-vaccine-btn">Add to Catalog</button>
        `
      });

      const addForm = document.getElementById("add-vaccine-form");
      validationService.attachLiveValidation(addForm);

      document.getElementById("save-new-vaccine-btn").addEventListener("click", () => {
        if (!validationService.validateForm(addForm)) return;
        const formData = new FormData(addForm);
        vaccineService.addVaccine({
          name: formData.get("vaccineName"),
          code: formData.get("code"),
          targetDisease: formData.get("targetDisease"),
          recommendedAge: formData.get("recommendedAge"),
          dosesRequired: formData.get("dosesRequired"),
          description: formData.get("description"),
          status: formData.get("status")
        });
        notificationService.showToast("New vaccine formulation registered!", "success");
        modal.close();
        refreshGrid();
      });
    });
  }

  attachCardActions();
}
