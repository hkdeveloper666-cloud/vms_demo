/**
 * Auth Feature - Registration for Parent and Hospital
 */
import { authService } from "../../services/AuthService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { PAKISTAN_CITIES } from "../../core/constants.js";
import { loader } from "../../components/Loader.js";

export function renderRegisterView(type = "parent") {
  const isHospital = type === "hospital";

  const citiesOptions = PAKISTAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join("");

  return `
    <div class="auth-wrapper">
      <div class="auth-card auth-card-wide">
        <div class="macos-traffic-lights" style="margin-bottom: 1rem;">
          <span class="macos-dot macos-dot-close"></span>
          <span class="macos-dot macos-dot-min"></span>
          <span class="macos-dot macos-dot-zoom"></span>
        </div>

        <div class="auth-header">
          <h2 class="auth-title">${isHospital ? "Hospital Provider Registration" : "Parent / Guardian Registration"}</h2>
          <p class="auth-subtitle">Create your digital VAXORA health account</p>
        </div>

        <form id="register-form" novalidate>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <!-- Name -->
            <div class="form-group">
              <label class="form-label" for="reg-name">
                ${isHospital ? "Hospital Name" : "Full Name"} <span class="required-star">*</span>
              </label>
              <input type="text" id="reg-name" name="${isHospital ? "hospitalName" : "fullName"}" class="form-control" placeholder="${isHospital ? "e.g. Shifa International" : "e.g. Fatima Ahmed"}" required>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label" for="reg-email">
                Email Address <span class="required-star">*</span>
              </label>
              <input type="email" id="reg-email" name="email" class="form-control" placeholder="name@domain.com" required>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label class="form-label" for="reg-phone">
                Contact Phone <span class="required-star">*</span>
              </label>
              <input type="tel" id="reg-phone" name="phone" class="form-control" placeholder="03001234567" required>
            </div>

            <!-- City -->
            <div class="form-group">
              <label class="form-label" for="reg-city">City <span class="required-star">*</span></label>
              <select id="reg-city" name="city" class="form-control" required>
                ${citiesOptions}
              </select>
            </div>
          </div>

          <!-- Address -->
          <div class="form-group">
            <label class="form-label" for="reg-address">
              Full Physical Address <span class="required-star">*</span>
            </label>
            <input type="text" id="reg-address" name="address" class="form-control" placeholder="House/Street, Sector, Block, Landmark" required>
          </div>

          ${
            isHospital
              ? `
            <div class="form-group">
              <label class="form-label" for="reg-desc">Hospital Description & Immunization Facilities</label>
              <textarea id="reg-desc" name="description" class="form-control" placeholder="Describe pediatric facilities, cold-chain storage, emergency response..."></textarea>
            </div>
          `
              : `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="reg-relation">Relationship to Child</label>
                <select id="reg-relation" name="relation" class="form-control">
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="reg-emergency">Emergency Contact Number</label>
                <input type="tel" id="reg-emergency" name="emergencyContact" class="form-control" placeholder="03009988776">
              </div>
            </div>
          `
          }

          <!-- Passwords Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label" for="reg-password">
                Password <span class="required-star">*</span>
              </label>
              <div class="input-wrapper">
                <input type="password" id="reg-password" name="password" class="form-control" placeholder="••••••••" required>
                <button type="button" class="password-toggle-btn" id="reg-toggle-pwd">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
              <!-- Strength meter -->
              <div class="password-strength-container">
                <div class="strength-bar-track">
                  <div class="strength-bar-fill" id="strength-fill"></div>
                </div>
                <div class="strength-text" id="strength-text">Password strength: None</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-confirm-password">
                Confirm Password <span class="required-star">*</span>
              </label>
              <input type="password" id="reg-confirm-password" name="confirmPassword" class="form-control" placeholder="••••••••" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1rem;">
            Complete Registration
          </button>
        </form>

        <div class="auth-footer">
          Already registered? <a href="#login-${type}">Sign in to your account</a>
        </div>
      </div>
    </div>
  `;
}

export function attachRegisterEvents(type = "parent") {
  const form = document.getElementById("register-form");
  const pwdInput = document.getElementById("reg-password");
  const toggleBtn = document.getElementById("reg-toggle-pwd");
  const strengthFill = document.getElementById("strength-fill");
  const strengthText = document.getElementById("strength-text");

  // Live form validation
  validationService.attachLiveValidation(form);

  // Toggle password eye
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener("click", () => {
      const isPwd = pwdInput.getAttribute("type") === "password";
      pwdInput.setAttribute("type", isPwd ? "text" : "password");
    });
  }

  // Live password strength indicator
  if (pwdInput && strengthFill && strengthText) {
    pwdInput.addEventListener("input", () => {
      const strength = validationService.calculatePasswordStrength(pwdInput.value);
      strengthFill.className = `strength-bar-fill ${strength.class}`;
      strengthText.textContent = `Password strength: ${strength.label} (Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)`;
    });
  }

  // Handle registration submission
  form.addEventListener("submit", e => {
    e.preventDefault();
    const isValid = validationService.validateForm(form);
    if (!isValid) {
      notificationService.showToast("Please fix the highlighted errors before submitting.", "error");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    loader.setButtonLoading(submitBtn, true, "Registering...");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setTimeout(() => {
      loader.setButtonLoading(submitBtn, false);

      if (type === "hospital") {
        const result = authService.registerHospital({
          name: data.hospitalName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          address: data.address,
          city: data.city,
          description: data.description
        });

        if (result.success) {
          notificationService.showToast("Hospital profile registered successfully!", "success");
          window.location.hash = "#hospital/dashboard";
        } else {
          notificationService.showToast(result.message, "error");
        }
      } else {
        const result = authService.registerParent({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          address: data.address,
          city: data.city,
          relation: data.relation,
          emergencyContact: data.emergencyContact
        });

        if (result.success) {
          notificationService.showToast("Parent account created! Welcome to VAXORA.", "success");
          window.location.hash = "#parent/dashboard";
        } else {
          notificationService.showToast(result.message, "error");
        }
      }
    }, 400);
  });
}
