/**
 * Auth Feature - Forgot Password
 */
import { validationService } from "../../services/ValidationService.js";
import { notificationService } from "../../services/NotificationService.js";

export function renderForgotPasswordView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="macos-traffic-lights" style="margin-bottom: 1rem;">
          <span class="macos-dot macos-dot-close"></span>
          <span class="macos-dot macos-dot-min"></span>
          <span class="macos-dot macos-dot-zoom"></span>
        </div>

        <div class="auth-header">
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-subtitle">Enter your registered email to receive verification link</p>
        </div>

        <form id="forgot-password-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="reset-email">Email Address <span class="required-star">*</span></label>
            <div class="input-wrapper has-icon-left">
              <div class="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input type="email" id="reset-email" name="email" class="form-control" placeholder="name@domain.com" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 0.75rem;">
            Send Password Reset Link
          </button>
        </form>

        <div class="auth-footer">
          Remember your credentials? <a href="#login-parent">Return to login</a>
        </div>
      </div>
    </div>
  `;
}

export function attachForgotPasswordEvents() {
  const form = document.getElementById("forgot-password-form");
  validationService.attachLiveValidation(form);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const isValid = validationService.validateForm(form);
    if (!isValid) return;

    notificationService.showToast("A simulated password reset email has been dispatched.", "success");
    setTimeout(() => {
      window.location.hash = "#login-parent";
    }, 1500);
  });
}
