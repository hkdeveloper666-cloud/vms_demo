/**
 * Parent Feature - Details of Child
 * Add child, edit child, and maintain child medical details
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { childService } from "../../services/ChildService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { appState } from "../../core/state.js";
import { modal } from "../../components/Modal.js";
import { formatDate, calculateAge } from "../../utils/dateUtils.js";
import { BLOOD_GROUPS, GENDERS } from "../../core/constants.js";

export function renderParentChildrenView() {
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";
  const children = childService.getChildrenByParent(parentId);

  return `
    <div class="app-shell">
      ${renderSidebar("children")}

      <div class="app-main-layout">
        ${renderNavbar("Details of Child", ["Parent", "Family", "Children Profiles"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Child Profiles & Medical Details</h1>
              <p class="page-header-subtitle">Register and maintain your children's birth dates, blood groups, allergies, and vaccination milestones</p>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-primary" id="btn-add-child">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Register New Child
              </button>
            </div>
          </div>

          <!-- Cards Grid of Parent's Children -->
          <div class="grid-cards-3" id="parent-children-grid">
            ${renderChildrenList(children)}
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderChildrenList(children) {
  if (children.length === 0) {
    return `
      <div class="glass-card" style="grid-column: 1/-1; padding: 3rem; text-align: center;">
        <h4 style="color:var(--dark-navy); margin-bottom:0.5rem;">No child registered yet</h4>
        <p class="text-sm">Click "Register New Child" to add an infant profile and schedule vaccinations.</p>
      </div>
    `;
  }

  return children
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

          <div style="background:var(--glass-bg-subtle); padding: 0.85rem; border-radius:var(--radius-sm); font-size:0.8rem; border:1px solid var(--glass-border-subtle); margin-bottom: 1rem;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:6px;">
              <div><strong>Gender:</strong> ${c.gender}</div>
              <div><strong>Blood Group:</strong> ${c.bloodGroup}</div>
            </div>
            <div style="margin-bottom:4px;"><strong>Parent Relation:</strong> ${c.parentRelation}</div>
            <div style="margin-bottom:4px;"><strong>Emergency Contact:</strong> ${c.emergencyContact}</div>
            <div style="color:var(--text-muted); font-size:0.75rem;"><strong>Allergies:</strong> ${c.allergies || "None declared"}</div>
          </div>
        </div>

        <div style="display:flex; gap: 0.5rem; pt: 0.75rem; border-top:1px solid var(--glass-border-subtle);">
          <button class="btn btn-secondary btn-sm edit-child-btn" data-id="${c.id}" style="flex:1;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Info
          </button>
          <a href="#parent/book" class="btn btn-primary btn-sm" style="flex:1;">
            Book Vaccine
          </a>
        </div>
      </div>
    `
    )
    .join("");
}

export function attachParentChildrenEvents() {
  attachNavbarEvents();

  const addBtn = document.getElementById("btn-add-child");
  const container = document.getElementById("parent-children-grid");
  const user = appState.getCurrentUser();
  const parentId = user?.id || "user-parent-1";

  function refreshList() {
    const list = childService.getChildrenByParent(parentId);
    container.innerHTML = renderChildrenList(list);
    attachCardListeners();
  }

  function attachCardListeners() {
    document.querySelectorAll(".edit-child-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const c = childService.getChildById(id);
        if (!c) return;

        const bloodOpts = BLOOD_GROUPS.map(
          bg => `<option value="${bg}" ${c.bloodGroup === bg ? "selected" : ""}>${bg}</option>`
        ).join("");

        modal.open({
          title: `Update Child Details — ${c.name}`,
          bodyHtml: `
            <form id="edit-child-form" novalidate>
              <div class="form-group">
                <label class="form-label" for="edit-child-name">Child Full Name <span class="required-star">*</span></label>
                <input type="text" id="edit-child-name" name="childName" class="form-control" value="${c.name}" required>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="edit-child-dob">Date of Birth <span class="required-star">*</span></label>
                  <input type="date" id="edit-child-dob" name="dob" class="form-control" value="${c.dob}" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-child-gender">Gender <span class="required-star">*</span></label>
                  <select id="edit-child-gender" name="gender" class="form-control">
                    <option value="Male" ${c.gender === "Male" ? "selected" : ""}>Male</option>
                    <option value="Female" ${c.gender === "Female" ? "selected" : ""}>Female</option>
                  </select>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="edit-child-bg">Blood Group</label>
                  <select id="edit-child-bg" name="bloodGroup" class="form-control">
                    ${bloodOpts}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-child-rel">Relationship</label>
                  <input type="text" id="edit-child-rel" name="parentRelation" class="form-control" value="${c.parentRelation || "Mother"}">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="edit-child-emerg">Emergency Contact Number <span class="required-star">*</span></label>
                <input type="tel" id="edit-child-emerg" name="phone" class="form-control" value="${c.emergencyContact || ""}" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="edit-child-allergies">Known Allergies / Sensitivities</label>
                <input type="text" id="edit-child-allergies" name="allergies" class="form-control" value="${c.allergies || ""}">
              </div>

              <div class="form-group">
                <label class="form-label" for="edit-child-notes">Pediatrician / Development Notes</label>
                <textarea id="edit-child-notes" name="notes" class="form-control">${c.notes || ""}</textarea>
              </div>
            </form>
          `,
          footerHtml: `
            <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
            <button class="btn btn-primary btn-sm" id="save-child-edit-btn">Save Changes</button>
          `
        });

        const form = document.getElementById("edit-child-form");
        validationService.attachLiveValidation(form);

        document.getElementById("save-child-edit-btn").addEventListener("click", () => {
          if (!validationService.validateForm(form)) return;
          const formData = new FormData(form);
          childService.updateChild(id, {
            name: formData.get("childName"),
            dob: formData.get("dob"),
            gender: formData.get("gender"),
            bloodGroup: formData.get("bloodGroup"),
            parentRelation: formData.get("parentRelation"),
            emergencyContact: formData.get("phone"),
            allergies: formData.get("allergies"),
            notes: formData.get("notes")
          });
          notificationService.showToast("Child details updated successfully.", "success");
          modal.close();
          refreshList();
        });
      });
    });
  }

  // Open Add Child Modal
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const bloodOpts = BLOOD_GROUPS.map(bg => `<option value="${bg}">${bg}</option>`).join("");

      modal.open({
        title: "Register New Child",
        bodyHtml: `
          <form id="add-child-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="add-child-name">Child Full Name <span class="required-star">*</span></label>
              <input type="text" id="add-child-name" name="childName" class="form-control" placeholder="e.g. Rayan Ahmed" required>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label" for="add-child-dob">Date of Birth <span class="required-star">*</span></label>
                <input type="date" id="add-child-dob" name="dob" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="add-child-gender">Gender <span class="required-star">*</span></label>
                <select id="add-child-gender" name="gender" class="form-control">
                  <option value="Male" selected>Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label" for="add-child-bg">Blood Group</label>
                <select id="add-child-bg" name="bloodGroup" class="form-control">
                  ${bloodOpts}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="add-child-rel">Relationship</label>
                <input type="text" id="add-child-rel" name="parentRelation" class="form-control" value="${user?.relation || "Mother"}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="add-child-emerg">Emergency Contact Phone <span class="required-star">*</span></label>
              <input type="tel" id="add-child-emerg" name="phone" class="form-control" value="${user?.emergencyContact || user?.phone || "03001234567"}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="add-child-allergies">Known Allergies / Sensitivities</label>
              <input type="text" id="add-child-allergies" name="allergies" class="form-control" placeholder="e.g. None or Penicillin allergy">
            </div>

            <div class="form-group">
              <label class="form-label" for="add-child-notes">Special Clinical Notes</label>
              <textarea id="add-child-notes" name="notes" class="form-control" placeholder="Birth weight, pre-term delivery, doctor instructions..."></textarea>
            </div>
          </form>
        `,
        footerHtml: `
          <button class="btn btn-secondary btn-sm" onclick="modal.close()">Cancel</button>
          <button class="btn btn-primary btn-sm" id="save-new-child-btn">Register Child</button>
        `
      });

      const form = document.getElementById("add-child-form");
      validationService.attachLiveValidation(form);

      document.getElementById("save-new-child-btn").addEventListener("click", () => {
        if (!validationService.validateForm(form)) return;
        const formData = new FormData(form);
        childService.addChild(
          {
            name: formData.get("childName"),
            dob: formData.get("dob"),
            gender: formData.get("gender"),
            bloodGroup: formData.get("bloodGroup"),
            parentRelation: formData.get("parentRelation"),
            emergencyContact: formData.get("phone"),
            allergies: formData.get("allergies"),
            notes: formData.get("notes")
          },
          user || { id: "user-parent-1", name: "Fatima Ahmed", phone: "03001234567" }
        );
        notificationService.showToast("Child profile registered in VAXORA!", "success");
        modal.close();
        refreshList();
      });
    });
  }

  attachCardListeners();
}
