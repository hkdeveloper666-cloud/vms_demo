/**
 * Auth Feature - Login Screen
 */
import { authService } from "../../services/AuthService.js";
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";
import { ROLES } from "../../core/constants.js";
import { loader } from "../../components/Loader.js";

export function renderLoginView(targetRole = "parent") {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="macos-traffic-lights" style="margin-bottom: 1rem;">
          <span class="macos-dot macos-dot-close"></span>
          <span class="macos-dot macos-dot-min"></span>
          <span class="macos-dot macos-dot-zoom"></span>
        </div>

        <div class="auth-header">
          <div class="auth-logo">
            <svg width="48" height="48" viewBox="0 0 44 44" fill="none">
              <path d="M22 4 C32 4 40 9.5 40 19.5 C40 31 25.5 39.5 22 42 C18.5 39.5 4 31 4 19.5 C4 9.5 12 4 22 4 Z" stroke="url(#vaxoraGradLogin)" stroke-width="3" fill="rgba(91, 141, 239, 0.12)"/>
              <path d="M22 13 L22 27 M15 20 L29 20" stroke="url(#vaxoraGradLogin)" stroke-width="3" stroke-linecap="round"/>
              <defs>
                <linearGradient id="vaxoraGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#5B8DEF" />
                  <stop offset="100%" stop-color="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your VAXORA health portal</p>
        </div>

        <!-- Role Selector Tabs -->
        <div class="auth-role-tabs">
          <button type="button" class="auth-role-tab ${targetRole === "parent" ? "active" : ""}" data-role="parent">Parent</button>
          <button type="button" class="auth-role-tab ${targetRole === "admin" ? "active" : ""}" data-role="admin">Admin</button>
          <button type="button" class="auth-role-tab ${targetRole === "hospital" ? "active" : ""}" data-role="hospital">Hospital</button>
        </div>

        <form id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">
              Email Address <span class="required-star">*</span>
            </label>
            <div class="input-wrapper has-icon-left">
              <div class="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input type="email" id="login-email" name="email" class="form-control" placeholder="name@domain.com" required>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">
              <span>Password <span class="required-star">*</span></span>
              <a href="#forgot-password" class="form-label-hint" style="color:var(--primary); font-weight:600;">Forgot Password?</a>
            </div>
            <div class="input-wrapper has-icon-left">
              <div class="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input type="password" id="login-password" name="password" class="form-control" placeholder="••••••••" required>
              <button type="button" class="password-toggle-btn" id="toggle-password-btn" aria-label="Toggle password visibility">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 0.75rem;">
            Sign In to Portal
          </button>
        </form>

        <!-- Demo Accounts Quick 1-Click Login -->
        <div class="demo-accounts-box">
          <div class="demo-accounts-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Instant Demo Logins
          </div>
          <div class="demo-pills-row">
            <button type="button" class="demo-pill-btn" data-demo-role="admin">🛡️ Admin</button>
            <button type="button" class="demo-pill-btn" data-demo-role="parent">👨‍👩‍👦 Parent</button>
            <button type="button" class="demo-pill-btn" data-demo-role="hospital">🏥 Hospital</button>
          </div>
        </div>

        <div class="auth-footer">
          Don't have an account? 
          <a href="#register-${targetRole}">Create ${targetRole === "hospital" ? "Hospital" : "Parent"} Account</a>
        </div>
      </div>
    </div>
  `;
}

export function attachLoginEvents(currentRole = "parent") {
  let selectedRole = currentRole;
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");

  // Prefill default demo for selected role
  if (selectedRole === "admin") {
    emailInput.value = "admin@vaxora.health";
    passInput.value = "Admin@1234";
  } else if (selectedRole === "parent") {
    emailInput.value = "fatima@gmail.com";
    passInput.value = "Parent@1234";
  } else if (selectedRole === "hospital") {
    emailInput.value = "shifa@hospital.com";
    passInput.value = "Hospital@1234";
  }

  // Live validation
  validationService.attachLiveValidation(form);

  // Tab role switching
  document.querySelectorAll(".auth-role-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-role-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      selectedRole = tab.getAttribute("data-role");
      
      // Update prefill credentials
      if (selectedRole === "admin") {
        emailInput.value = "admin@vaxora.health";
        passInput.value = "Admin@1234";
      } else if (selectedRole === "parent") {
        emailInput.value = "fatima@gmail.com";
        passInput.value = "Parent@1234";
      } else if (selectedRole === "hospital") {
        emailInput.value = "shifa@hospital.com";
        passInput.value = "Hospital@1234";
      }
      
      const footerLink = document.querySelector(".auth-footer a");
      if (footerLink) {
        footerLink.href = `#register-${selectedRole}`;
        footerLink.textContent = `Create ${selectedRole === "hospital" ? "Hospital" : "Parent"} Account`;
      }
    });
  });

  // Password toggle
  const toggleBtn = document.getElementById("toggle-password-btn");
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener("click", () => {
      const type = passInput.getAttribute("type") === "password" ? "text" : "password";
      passInput.setAttribute("type", type);
    });
  }

  // Quick 1-click Demo logins
  document.querySelectorAll("[data-demo-role]").forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.getAttribute("data-demo-role");
      const user = authService.switchDemoUser(role);
      if (user) {
        notificationService.showToast(`Logged in as ${user.name} (${role.toUpperCase()})`, "success");
        window.location.hash = `#${role}/dashboard`;
      }
    });
  });

  // Form submit
  form.addEventListener("submit", e => {
    e.preventDefault();
    const isValid = validationService.validateForm(form);
    if (!isValid) {
      notificationService.showToast("Please correct the form errors before continuing.", "error");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    loader.setButtonLoading(submitBtn, true, "Signing In...");

    const email = emailInput.value;
    const password = passInput.value;

    setTimeout(() => {
      const result = authService.login(email, password, selectedRole);
      loader.setButtonLoading(submitBtn, false);

      if (result.success) {
        notificationService.showToast(`Welcome back, ${result.user.name}!`, "success");
        window.location.hash = `#${result.user.role}/dashboard`;
      } else {
        notificationService.showToast(result.message, "error");
      }
    }, 350);
  });
}
