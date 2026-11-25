/**
 * ValidationService
 * Advanced Regex-based form and field validation engine
 */
import { isPastDate, isFutureDate } from "../utils/dateUtils.js";

class ValidationService {
  constructor() {
    // Regular Expressions
    this.regexPatterns = {
      // Alphabetic names with spaces, hyphens, and apostrophes (3-50 chars)
      fullName: /^[a-zA-Z\s'.\-]{3,50}$/,
      // Standard RFC-compliant email regex
      email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
      // Strong password: min 8, 1 uppercase, 1 lowercase, 1 number, 1 special character
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+\-=[\]{}|;:,.<>]{8,}$/,
      // Pakistan phone: 03XXXXXXXXX or +923XXXXXXXXX
      phone: /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^03\d{9}$/,
      // Hospital name: letters, numbers, spaces, dots, ampersand (3-100 chars)
      hospitalName: /^[a-zA-Z0-9\s'.&,\-]{3,100}$/,
      // Child name: letters and spaces (2-50 chars)
      childName: /^[a-zA-Z\s'.\-]{2,50}$/,
      // Vaccine name: alphanumeric, parentheses, hyphens (2-80 chars)
      vaccineName: /^[a-zA-Z0-9\s().+\-]{2,80}$/
    };
  }

  /**
   * Validate a single field by name
   */
  validateField(fieldName, value, extraContext = {}) {
    const val = typeof value === "string" ? value.trim() : value;

    switch (fieldName) {
      case "fullName":
      case "name":
        if (!val) return { isValid: false, message: "Full Name is required." };
        if (val.length < 3) return { isValid: false, message: "Name must be at least 3 characters." };
        if (val.length > 50) return { isValid: false, message: "Name cannot exceed 50 characters." };
        if (!this.regexPatterns.fullName.test(val)) {
          return { isValid: false, message: "Name can only contain letters, spaces, and hyphens." };
        }
        return { isValid: true, message: "" };

      case "email":
        if (!val) return { isValid: false, message: "Email address is required." };
        if (!this.regexPatterns.email.test(val)) {
          return { isValid: false, message: "Please enter a valid email address (e.g., name@domain.com)." };
        }
        return { isValid: true, message: "" };

      case "password":
        if (!val) return { isValid: false, message: "Password is required." };
        if (val.length < 8) return { isValid: false, message: "Password must be at least 8 characters." };
        if (!/(?=.*[a-z])/.test(val)) return { isValid: false, message: "Must include at least one lowercase letter." };
        if (!/(?=.*[A-Z])/.test(val)) return { isValid: false, message: "Must include at least one uppercase letter." };
        if (!/(?=.*\d)/.test(val)) return { isValid: false, message: "Must include at least one number." };
        if (!/(?=.*[@$!%*?&#^()_+\-=[\]{}|;:,.<>])/.test(val)) {
          return { isValid: false, message: "Must include at least one special character (@$!%*?&#)." };
        }
        return { isValid: true, message: "" };

      case "confirmPassword":
        if (!val) return { isValid: false, message: "Please confirm your password." };
        if (val !== extraContext.password) {
          return { isValid: false, message: "Passwords do not match." };
        }
        return { isValid: true, message: "" };

      case "phone":
        if (!val) return { isValid: false, message: "Contact phone number is required." };
        if (!this.regexPatterns.phone.test(val.replace(/[\s-]/g, ""))) {
          return { isValid: false, message: "Please enter a valid phone number (e.g., 03001234567)." };
        }
        return { isValid: true, message: "" };

      case "hospitalName":
        if (!val) return { isValid: false, message: "Hospital name is required." };
        if (val.length < 3 || val.length > 100) {
          return { isValid: false, message: "Hospital name must be between 3 and 100 characters." };
        }
        if (!this.regexPatterns.hospitalName.test(val)) {
          return { isValid: false, message: "Hospital name contains invalid characters." };
        }
        return { isValid: true, message: "" };

      case "childName":
        if (!val) return { isValid: false, message: "Child name is required." };
        if (!this.regexPatterns.childName.test(val)) {
          return { isValid: false, message: "Child name must only contain valid alphabetic characters (2-50 chars)." };
        }
        return { isValid: true, message: "" };

      case "dob":
        if (!val) return { isValid: false, message: "Date of Birth is required." };
        if (!isPastDate(val) && val !== new Date().toISOString().split("T")[0]) {
          return { isValid: false, message: "Date of Birth cannot be in the future." };
        }
        return { isValid: true, message: "" };

      case "appointmentDate":
        if (!val) return { isValid: false, message: "Appointment Date is required." };
        if (!isFutureDate(val)) {
          return { isValid: false, message: "Appointment date must be today or a future date." };
        }
        return { isValid: true, message: "" };

      case "address":
        if (!val) return { isValid: false, message: "Address is required." };
        if (val.length < 5) return { isValid: false, message: "Please enter a detailed address (min 5 chars)." };
        if (val.length > 200) return { isValid: false, message: "Address cannot exceed 200 characters." };
        return { isValid: true, message: "" };

      case "vaccineName":
        if (!val) return { isValid: false, message: "Vaccine name is required." };
        if (!this.regexPatterns.vaccineName.test(val)) {
          return { isValid: false, message: "Please enter a valid vaccine designation (min 2 chars)." };
        }
        return { isValid: true, message: "" };

      case "selectRequired":
        if (!val || val === "") return { isValid: false, message: "Please make a selection." };
        return { isValid: true, message: "" };

      default:
        if (!val) return { isValid: false, message: "This field is required." };
        return { isValid: true, message: "" };
    }
  }

  /**
   * Password strength calculation: 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
   */
  calculatePasswordStrength(password) {
    if (!password) return { score: 0, label: "None", class: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#^()_+\-=[\]{}|;:,.<>]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", class: "weak" };
      case 2:
        return { score: 2, label: "Fair", class: "fair" };
      case 3:
        return { score: 3, label: "Good", class: "good" };
      case 4:
        return { score: 4, label: "Strong", class: "strong" };
      default:
        return { score: 0, label: "Weak", class: "weak" };
    }
  }

  /**
   * Attach live validation to form inputs
   */
  attachLiveValidation(formElement) {
    if (!formElement) return;

    const inputs = formElement.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener("blur", () => {
        this.validateInputUI(input, formElement);
      });

      // Clear error as user types
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) {
          this.validateInputUI(input, formElement);
        }
      });
    });
  }

  /**
   * Update input UI with error/success feedback
   */
  validateInputUI(input, formElement) {
    const fieldName = input.getAttribute("name") || input.id;
    const value = input.value;
    const extraContext = {};

    if (fieldName === "confirmPassword") {
      const passwordInput = formElement.querySelector('[name="password"]') || formElement.querySelector("#password");
      if (passwordInput) extraContext.password = passwordInput.value;
    }

    const result = this.validateField(fieldName, value, extraContext);
    const formGroup = input.closest(".form-group");

    if (formGroup) {
      let invalidFeedback = formGroup.querySelector(".invalid-feedback");
      if (!invalidFeedback) {
        invalidFeedback = document.createElement("div");
        invalidFeedback.className = "invalid-feedback validation-feedback";
        formGroup.appendChild(invalidFeedback);
      }

      if (!result.isValid) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        invalidFeedback.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${result.message}`;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        invalidFeedback.innerHTML = "";
      }
    }

    return result.isValid;
  }

  /**
   * Validate entire form on submit
   */
  validateForm(formElement) {
    let isFormValid = true;
    const inputs = formElement.querySelectorAll("input, select, textarea");

    inputs.forEach(input => {
      // Skip hidden or disabled inputs
      if (input.type === "hidden" || input.disabled) return;
      const isValid = this.validateInputUI(input, formElement);
      if (!isValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }
}

export const validationService = new ValidationService();
