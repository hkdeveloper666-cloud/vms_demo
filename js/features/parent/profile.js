/**
 * Parent Feature - My Profile
 * Edit parent profile details, phone numbers, and address
 */
import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar, attachNavbarEvents } from "../../components/Navbar.js";
import { storageService } from "../../services/StorageService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { appState } from "../../core/state.js";
import { STORAGE_KEYS } from "../../core/constants.js";

export function renderParentProfileView() {
  const user = appState.getCurrentUser() || {
    name: "Fatima Ahmed",
    email: "fatima@gmail.com",
    phone: "03001234567",
    address: "House 42, Street 8, Sector F-7/2, Islamabad",
    city: "Islamabad",
    relation: "Mother",
    emergencyContact: "03009988776",
    avatar: "FA"
  };

  return `
    <div class="app-shell">
      ${renderSidebar("profile")}

      <div class="app-main-layout">
        ${renderNavbar("My Profile", ["Parent", "Account Settings"])}

        <main class="app-content animate-fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-header-title">Parent Profile & Contact Settings</h1>
              <p class="page-header-subtitle">Manage your guardian details, emergency contact numbers, and verified home address</p>
            </div>
          </div>

          <div class="grid-two-column">
            <!-- Left: Edit Form -->
            <div class="glass-card">
              <form id="parent-profile-form" novalidate>
                <div class="form-group">
                  <label class="form-label" for="profile-name">Full Name <span class="required-star">*</span></label>
                  <input type="text" id="profile-name" name="fullName" class="form-control" value="${user.name}" required>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                  <div class="form-group">
                    <label class="form-label" for="profile-email">Email Address</label>
                    <input type="email" id="profile-email" class="form-control" value="${user.email}" disabled title="Email is locked to account identity">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="profile-phone">Contact Phone <span class="required-star">*</span></label>
                    <input type="tel" id="profile-phone" name="phone" class="form-control" value="${user.phone}" required>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                  <div class="form-group">
                    <label class="form-label" for="profile-relation">Relationship to Children</label>
                    <select id="profile-relation" name="relation" class="form-control">
                      <option value="Mother" ${user.relation === "Mother" ? "selected" : ""}>Mother</option>
                      <option value="Father" ${user.relation === "Father" ? "selected" : ""}>Father</option>
                      <option value="Legal Guardian" ${user.relation === "Legal Guardian" ? "selected" : ""}>Legal Guardian</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="profile-emerg">Emergency Phone Number</label>
                    <input type="tel" id="profile-emerg" name="emergencyContact" class="form-control" value="${user.emergencyContact || user.phone}">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="profile-address">Home Street Address <span class="required-star">*</span></label>
                  <input type="text" id="profile-address" name="address" class="form-control" value="${user.address}" required>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">
                  Save Profile Changes
                </button>
              </form>
            </div>

            <!-- Right: Account Card -->
            <div>
              <div class="glass-card" style="text-align:center; padding: 2.25rem 1.5rem;">
                <div style="width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--secondary)); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:1.75rem; font-weight:800; margin: 0 auto 1rem; box-shadow:0 10px 25px var(--primary-glow);">
                  ${user.avatar || "FA"}
                </div>
                <h3 style="font-size:1.3rem; margin-bottom:0.25rem;">${user.name}</h3>
                <p class="text-sm" style="color:var(--primary); font-weight:700; margin-bottom:1.25rem;">${user.relation || "Parent"} • Verified Account</p>

                <div style="text-align:left; background:var(--glass-bg-subtle); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--glass-border-subtle); font-size:0.85rem;">
                  <div style="margin-bottom:6px;"><strong>City:</strong> ${user.city || "Islamabad"}</div>
                  <div style="margin-bottom:6px;"><strong>Phone:</strong> ${user.phone}</div>
                  <div><strong>Account Status:</strong> <span style="color:var(--status-success-text); font-weight:700;">Active</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

export function attachParentProfileEvents() {
  attachNavbarEvents();

  const form = document.getElementById("parent-profile-form");
  validationService.attachLiveValidation(form);

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validationService.validateForm(form)) {
      notificationService.showToast("Please check the form inputs.", "error");
      return;
    }

    const name = document.getElementById("profile-name").value;
    const phone = document.getElementById("profile-phone").value;
    const relation = document.getElementById("profile-relation").value;
    const emergencyContact = document.getElementById("profile-emerg").value;
    const address = document.getElementById("profile-address").value;

    const user = appState.getCurrentUser();
    if (user) {
      user.name = name;
      user.phone = phone;
      user.relation = relation;
      user.emergencyContact = emergencyContact;
      user.address = address;

      // Update storage
      storageService.set(STORAGE_KEYS.CURRENT_USER, user);

      const users = storageService.get(STORAGE_KEYS.USERS, []);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...user };
        storageService.set(STORAGE_KEYS.USERS, users);
      }

      appState.setCurrentUser(user);
      notificationService.showToast("Profile details updated successfully!", "success");
    }
  });
}
