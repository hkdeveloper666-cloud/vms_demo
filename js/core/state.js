/**
 * Central State Store for Current User and Session Context
 */
import { eventBus } from "./eventBus.js";

class AppState {
  constructor() {
    this.currentUser = null;
    this.activeRoute = "";
    this.theme = "light";
    this.unreadNotificationsCount = 0;
    this.isSidebarCollapsed = localStorage.getItem("vaxora_sidebar_collapsed") === "true";
    this.isMobileSidebarOpen = false;

    // Synchronize initial body class for sidebar
    if (this.isSidebarCollapsed && window.innerWidth > 992) {
      document.body.classList.add("sidebar-collapsed");
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    eventBus.emit("auth:change", user);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setActiveRoute(route) {
    this.activeRoute = route;
    // Always close mobile drawer on route change
    this.setMobileSidebarOpen(false);
    eventBus.emit("route:change", route);
  }

  setTheme(theme) {
    this.theme = theme;
    eventBus.emit("theme:change", theme);
  }

  setUnreadNotificationsCount(count) {
    this.unreadNotificationsCount = count;
    eventBus.emit("notifications:count", count);
  }

  toggleSidebarCollapsed() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem("vaxora_sidebar_collapsed", this.isSidebarCollapsed ? "true" : "false");
    
    if (this.isSidebarCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }

    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("is-collapsed", this.isSidebarCollapsed);
    }

    const toggleBtn = document.getElementById("sidebar-toggle-btn");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", (!this.isSidebarCollapsed).toString());
    }

    eventBus.emit("sidebar:toggle", this.isSidebarCollapsed);
    return this.isSidebarCollapsed;
  }

  setMobileSidebarOpen(open) {
    this.isMobileSidebarOpen = !!open;
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const toggleBtn = document.getElementById("sidebar-toggle-btn");

    if (sidebar) {
      sidebar.classList.toggle("mobile-open", this.isMobileSidebarOpen);
    }
    if (backdrop) {
      backdrop.classList.toggle("is-active", this.isMobileSidebarOpen);
    }
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", this.isMobileSidebarOpen.toString());
    }

    if (this.isMobileSidebarOpen) {
      document.body.classList.add("mobile-drawer-open");
    } else {
      document.body.classList.remove("mobile-drawer-open");
    }

    eventBus.emit("sidebar:mobile", this.isMobileSidebarOpen);
  }
}

export const appState = new AppState();
