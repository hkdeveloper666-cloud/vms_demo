/**
 * Admin Feature - Hospital Management (Add, Update, Delete, List)
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { hospitalService } from "../../services/HospitalService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { modal } from "../../components/Modal.js";
import { PAKISTAN_CITIES } from "../../core/constants.js";

export function renderAdminHospitalsView() {
  const hospitals = hospitalService.getAllHospitals();
  const cityOptions = PAKISTAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join("");

  return `
    <div class="app-shell">
      ${renderSidebar("hospitals")}

      <div class="app-main-layout">
        ${renderNavbar("List of Hospitals", ["Admin", "Hospital Network"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Immunization Centers & Hospitals</h1>
              <p class="page-header-subtitle">Accredit healthcare providers, configure vaccination clinics, and update hospital profiles</p>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-primary" id="btn-add-hospital">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Hospital
              </button>
            </div>
          </div>

          <!-- Search & Filter Toolbar -->
          <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
            <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; justify-content:space-between;">
              <div style="display:flex; flex-wrap:wrap; gap: 1rem; align-items:center; flex:1;">
                <div style="position:relative; min-width: 260px;">
                  <input type="text" id="hosp-search-input" class="form-control" placeholder="Search hospital name or area...">
                </div>
                <select id="hosp-city-filter" class="form-control" style="width: 170px;">
                  <option value="all">All Cities</option>
                  ${cityOptions}
                </select>
              </div>

              <div class="text-sm font-semibold" style="color:var(--text-muted);" id="hosp-count-badge">
                Showing ${hospitals.length} Centers
              </div>
            </div>
          </div>

          <!-- Hospitals Grid / Table -->
          <div class="grid-cards-3" id="hospitals-grid-container">
            ${renderHospitalsCards(hospitals)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderHospitalsCards(hospitals) {
  if (hospitals.length === 0) {
    return `<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">No hospitals match your search criteria.</div>`;
  }

  return hospitals
    .map(
      h => `
      <div class="glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.85rem;">
            <span class="glass-pill glass-pill-success">Active Center</span>
            <div style="width:40px; height:40px; border-radius:var(--radius-sm); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:700;">
              🏥
            </div>
          </div>

          <h3 style="font-size: 1.2rem; margin-bottom: 0.35rem; color:var(--dark-navy);">${h.name}</h3>
          <div class="text-xs font-semibold" style="color:var(--primary); margin-bottom: 0.75rem;">
            ${h.city} • ${h.phone}
          </div>

          <p class="text-sm" style="margin-bottom: 1rem; line-height: 1.45;">
            ${h.description || "Fully equipped pediatric vaccination department."}
          </p>

          <div style="background:var(--glass-bg-subtle); padding: 0.75rem; border-radius:var(--radius-sm); font-size:0.8rem; border:1px solid var(--glass-border-subtle); margin-bottom: 1rem;">
            <div style="margin-bottom:4px; color:var(--text-main);">
              <strong>Address:</strong> ${h.address}
            </div>
            <div style="color:var(--text-muted);">
              <strong>Geo Coordinates:</strong> ${h.location || "Urban Sector"}
            </div>
            <div style="margin-top:4px; color:var(--accent-emerald); font-weight:600;">
              💉 ${h.totalDosesAdministered || 0} Doses Administered
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:flex-end; gap: 0.5rem; padding-top: 0.75rem; border-top:1px solid var(--glass-border-subtle);">
          <button class="btn btn-secondary btn-sm edit-hosp-btn" data-id="${h.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </button>
          <button class="btn btn-danger btn-sm delete-hosp-btn" data-id="${h.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

export function attachAdminHospitalsEvents() {
  attachNavbarEvents();

  const searchInput = document.getElementById("hosp-search-input");
  const cityFilter = document.getElementById("hosp-city-filter");
  const gridContainer = document.getElementById("hospitals-grid-container");
  const countBadge = document.getElementById("hosp-count-badge");
  const addBtn = document.getElementById("btn-add-hospital");

  function refreshGrid() {
    const search = searchInput.value;
    const city = cityFilter.value;
    const filtered = hospitalService.searchHospitals({ search, city });
    gridContainer.innerHTML = renderHospitalsCards(filtered);
    if (countBadge) countBadge.textContent = `Showing ${filtered.length} Centers`;
    attachHospitalActions();
  }

  if (searchInput) searchInput.addEventListener("input", refreshGrid);
  if (cityFilter) cityFilter.addEventListener("change", refreshGrid);

  function attachHospitalActions() {
    // Edit Hospital
    document.querySelectorAll(".edit-hosp-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const h = hospitalService.getHospitalById(id);
        if (!h) return;

        const cityOpts = PAKISTAN_CITIES.map(
          c => `<option value="${c}" ${h.city === c ? "selected" : ""}>${c}</option>`
        ).join("");

        modal.open({
          title: `Update Hospital — ${h.name}`,
          bodyHtml: `
            <form id="edit-hosp-form" novalidate>
              <div class="form-group">
                <label class="form-label" for="edit-hosp-name">Hospital Name <span class="required-star">*</span></label>
                <input type="text" id="edit-hosp-name" name="hospitalName" class="form-control" value="${h.name}" required>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="edit-hosp-email">Official Email <span class="required-star">*</span></label>
                  <input type="email" id="edit-hosp-email" name="email" class="form-control" value="${h.email}" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-hosp-phone">Contact Phone <span class="required-star">*</span></label>
                  <input type="tel" id="edit-hosp-phone" name="phone" class="form-control" value="${h.phone}" required>
                </div>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="edit-hosp-city">City <span class="required-star">*</span></label>
                  <select id="edit-hosp-city" name="city" class="form-control">
                    ${cityOpts}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-hosp-loc">Coordinates / Landmark</label>
                  <input type="text" id="edit-hosp-loc" name="location" class="form-control" value="${h.location}">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-hosp-address">Full Physical Address <span class="required-star">*</span></label>
                <input type="text" id="edit-hosp-address" name="address" class="form-control" value="${h.address}" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-hosp-desc">Description</label>
                <textarea id="edit-hosp-desc" name="description" class="form-control">${h.description}</textarea>
              </div>
            </form>
          `,
          footerHtml: `
            <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
            <button class="btn btn-primary btn-sm" id="save-edit-hosp-btn">Save Hospital</button>
          `
        });

        const form = document.getElementById("edit-hosp-form");
        validationService.attachLiveValidation(form);

        document.getElementById("save-edit-hosp-btn").addEventListener("click", () => {
          if (!validationService.validateForm(form)) return;
          const formData = new FormData(form);
          hospitalService.updateHospital(id, {
            name: formData.get("hospitalName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            city: formData.get("city"),
            location: formData.get("location"),
            address: formData.get("address"),
            description: formData.get("description")
          });
          notificationService.showToast("Hospital details successfully saved.", "success");
          modal.close();
          refreshGrid();
        });
      });
    });

    // Delete Hospital
    document.querySelectorAll(".delete-hosp-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to deactivate and remove this medical center?")) {
          hospitalService.deleteHospital(id);
          notificationService.showToast("Hospital deleted.", "warning");
          refreshGrid();
        }
      });
    });
  }

  // Add Hospital Modal
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const cityOpts = PAKISTAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join("");

      modal.open({
        title: "Add New Vaccination Center / Hospital",
        bodyHtml: `
          <form id="add-hosp-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="add-hosp-name">Hospital Name <span class="required-star">*</span></label>
              <input type="text" id="add-hosp-name" name="hospitalName" class="form-control" placeholder="e.g. Quaid-e-Azam International" required>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label" for="add-hosp-email">Official Email <span class="required-star">*</span></label>
                <input type="email" id="add-hosp-email" name="email" class="form-control" placeholder="hospital@domain.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="add-hosp-phone">Contact Phone <span class="required-star">*</span></label>
                <input type="tel" id="add-hosp-phone" name="phone" class="form-control" placeholder="03335551234" required>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label" for="add-hosp-city">City <span class="required-star">*</span></label>
                <select id="add-hosp-city" name="city" class="form-control">
                  ${cityOpts}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="add-hosp-loc">Coordinates / Sector Landmark</label>
                <input type="text" id="add-hosp-loc" name="location" class="form-control" placeholder="e.g. Sector H-8/4">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="add-hosp-address">Full Physical Address <span class="required-star">*</span></label>
              <input type="text" id="add-hosp-address" name="address" class="form-control" placeholder="Street, Avenue, Building Number" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="add-hosp-desc">Hospital Description</label>
              <textarea id="add-hosp-desc" name="description" class="form-control" placeholder="Cold chain reliability, pediatric emergency equipment..."></textarea>
            </div>
          </form>
        `,
        footerHtml: `
          <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
          <button class="btn btn-primary btn-sm" id="save-new-hosp-btn">Register Hospital</button>
        `
      });

      const form = document.getElementById("add-hosp-form");
      validationService.attachLiveValidation(form);

      document.getElementById("save-new-hosp-btn").addEventListener("click", () => {
        if (!validationService.validateForm(form)) return;
        const formData = new FormData(form);
        hospitalService.addHospital({
          name: formData.get("hospitalName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          city: formData.get("city"),
          location: formData.get("location"),
          address: formData.get("address"),
          description: formData.get("description")
        });
        notificationService.showToast("New hospital added to immunization network!", "success");
        modal.close();
        refreshGrid();
      });
    });
  }

  attachHospitalActions();
}
