/**
 * Router
 * Hash-based client-side router with role protection, demo fallbacks, and view mounting
 */
import { appState } from "./state.js";
import { authService } from "../services/AuthService.js";
import { setHtml } from "../utils/domUtils.js";
import { loader } from "../components/Loader.js";

// Landing Page
import { renderLandingPage, attachLandingEvents } from "../features/landing.js";

// Auth
import { renderLoginView, attachLoginEvents } from "../features/auth/login.js";
import { renderRegisterView, attachRegisterEvents } from "../features/auth/register.js";
import { renderForgotPasswordView, attachForgotPasswordEvents } from "../features/auth/forgot-password.js";

// Admin Features
import { renderAdminDashboard, attachAdminDashboardEvents } from "../features/admin/dashboard.js";
import { renderAdminChildrenView, attachAdminChildrenEvents } from "../features/admin/children.js";
import { renderAdminScheduleView, attachAdminScheduleEvents } from "../features/admin/schedule.js";
import { renderAdminReportsView, attachAdminReportsEvents } from "../features/admin/reports.js";
import { renderAdminVaccinesView, attachAdminVaccinesEvents } from "../features/admin/vaccines.js";
import { renderAdminRequestsView, attachAdminRequestsEvents } from "../features/admin/requests.js";
import { renderAdminHospitalsView, attachAdminHospitalsEvents } from "../features/admin/hospitals.js";
import { renderAdminBookingsView, attachAdminBookingsEvents } from "../features/admin/bookings.js";

// Parent Features
import { renderParentDashboard, attachParentDashboardEvents } from "../features/parent/dashboard.js";
import { renderParentChildrenView, attachParentChildrenEvents } from "../features/parent/children.js";
import { renderParentScheduleView, attachParentScheduleEvents } from "../features/parent/schedule.js";
import { renderParentBookView, attachParentBookEvents } from "../features/parent/book.js";
import { renderParentRequestsView, attachParentRequestsEvents } from "../features/parent/requests.js";
import { renderParentHistoryView, attachParentHistoryEvents } from "../features/parent/history.js";
import { renderParentProfileView, attachParentProfileEvents } from "../features/parent/profile.js";

// Hospital Features
import { renderHospitalDashboard, attachHospitalDashboardEvents } from "../features/hospital/dashboard.js";
import { renderHospitalAppointmentsView, attachHospitalAppointmentsEvents } from "../features/hospital/appointments.js";
import { renderHospitalStatusView, attachHospitalStatusEvents } from "../features/hospital/vaccination-status.js";

class Router {
  constructor() {
    this.routes = {};
    this.appContainer = document.getElementById("app");
  }

  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    // First load
    this.handleRoute();
  }

  handleRoute() {
    let hash = window.location.hash.slice(1) || "landing";

    // Show top progress bar
    loader.showPageLoader();

    // Scroll top
    window.scrollTo(0, 0);

    // Close any lingering modal
    const existingModal = document.getElementById("vaxora-modal-backdrop");
    if (existingModal) existingModal.remove();

    // Auto-close mobile drawer on route change
    appState.setMobileSidebarOpen(false);

    appState.setActiveRoute(hash);

    try {
      // Route Dispatcher
    switch (hash) {
      case "landing":
      case "":
        setHtml(this.appContainer, renderLandingPage());
        attachLandingEvents();
        break;

      // Auth
      case "login-admin":
        setHtml(this.appContainer, renderLoginView("admin"));
        attachLoginEvents("admin");
        break;
      case "login-parent":
        setHtml(this.appContainer, renderLoginView("parent"));
        attachLoginEvents("parent");
        break;
      case "login-hospital":
        setHtml(this.appContainer, renderLoginView("hospital"));
        attachLoginEvents("hospital");
        break;
      case "register-parent":
        setHtml(this.appContainer, renderRegisterView("parent"));
        attachRegisterEvents("parent");
        break;
      case "register-hospital":
        setHtml(this.appContainer, renderRegisterView("hospital"));
        attachRegisterEvents("hospital");
        break;
      case "forgot-password":
        setHtml(this.appContainer, renderForgotPasswordView());
        attachForgotPasswordEvents();
        break;

      // Admin Portal Routes
      case "admin/dashboard":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminDashboard());
        attachAdminDashboardEvents();
        break;
      case "admin/children":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminChildrenView());
        attachAdminChildrenEvents();
        break;
      case "admin/schedule":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminScheduleView());
        attachAdminScheduleEvents();
        break;
      case "admin/reports":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminReportsView());
        attachAdminReportsEvents();
        break;
      case "admin/vaccines":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminVaccinesView());
        attachAdminVaccinesEvents();
        break;
      case "admin/requests":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminRequestsView());
        attachAdminRequestsEvents();
        break;
      case "admin/hospitals":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminHospitalsView());
        attachAdminHospitalsEvents();
        break;
      case "admin/bookings":
        this.ensureRole("admin");
        setHtml(this.appContainer, renderAdminBookingsView());
        attachAdminBookingsEvents();
        break;

      // Parent Portal Routes
      case "parent/dashboard":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentDashboard());
        attachParentDashboardEvents();
        break;
      case "parent/children":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentChildrenView());
        attachParentChildrenEvents();
        break;
      case "parent/schedule":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentScheduleView());
        attachParentScheduleEvents();
        break;
      case "parent/book":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentBookView());
        attachParentBookEvents();
        break;
      case "parent/requests":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentRequestsView());
        attachParentRequestsEvents();
        break;
      case "parent/history":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentHistoryView());
        attachParentHistoryEvents();
        break;
      case "parent/profile":
        this.ensureRole("parent");
        setHtml(this.appContainer, renderParentProfileView());
        attachParentProfileEvents();
        break;

      // Hospital Portal Routes
      case "hospital/dashboard":
        this.ensureRole("hospital");
        setHtml(this.appContainer, renderHospitalDashboard());
        attachHospitalDashboardEvents();
        break;
      case "hospital/appointments":
        this.ensureRole("hospital");
        setHtml(this.appContainer, renderHospitalAppointmentsView());
        attachHospitalAppointmentsEvents();
        break;
      case "hospital/status":
        this.ensureRole("hospital");
        setHtml(this.appContainer, renderHospitalStatusView());
        attachHospitalStatusEvents();
        break;

      default:
        // Default to landing
        setHtml(this.appContainer, renderLandingPage());
        attachLandingEvents();
        break;
    }
    } finally {
      setTimeout(() => loader.hidePageLoader(), 150);
    }
  }

  /**
   * Helper to ensure valid session role or seamlessly auto-switch demo role for review
   */
  ensureRole(role) {
    const current = authService.getCurrentUser();
    if (!current || current.role !== role) {
      authService.switchDemoUser(role);
    }
  }
}

export const router = new Router();
