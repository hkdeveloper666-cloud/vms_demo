/**
 * Navbar Component
 * macOS Glass top navigation with breadcrumbs, search, notification trigger, theme switch, and user profile dropdown
 */
import { appState } from "../core/state.js";
import { authService } from "../services/AuthService.js";
import { themeService } from "../services/ThemeService.js";
import { notificationService } from "../services/NotificationService.js";
import { ROLES } from "../core/constants.js";
import { attachSidebarEvents } from "./Sidebar.js";

export function renderNavbar(title = "Dashboard", breadcrumbs = ["Home", "Dashboard"]) {
  const user = appState.getCurrentUser();
  const unreadCount = notificationService.getUnreadCount();
  const isDark = themeService.isDark();
  const isDesktop = window.innerWidth > 992;
  const isExpanded = isDesktop ? !appState.isSidebarCollapsed : appState.isMobileSidebarOpen;

  const breadcrumbsHtml = breadcrumbs
    .map((crumb, idx) => {
      const isLast = idx === breadcrumbs.length - 1;
      return `
        <span class="${isLast ? "breadcrumb-current" : "breadcrumb-root"}">${crumb}</span>
        ${!isLast ? '<span class="breadcrumb-separator">/</span>' : ""}
      `;
    })
    .join("");

  return `
    <header class="app-navbar">
      <div class="navbar-left">
        <button class="sidebar-toggle-btn" id="sidebar-toggle-btn" aria-label="Toggle Navigation Sidebar" aria-controls="app-sidebar" aria-expanded="${isExpanded}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <nav class="navbar-breadcrumbs" aria-label="Breadcrumb">
          ${breadcrumbsHtml}
        </nav>
      </div>

      <div class="navbar-right">
        <!-- Quick Global Search -->
        <div class="navbar-search">
          <svg class="navbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="global-navbar-search" placeholder="Search records, vaccines..." autocomplete="off">
        </div>

        <!-- Theme Toggle -->
        <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle Light / Dark mode" aria-label="Toggle Theme">
          ${
            isDark
              ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
              : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
          }
        </button>

        <!-- Notification Trigger -->
        <div style="position: relative;">
          <button class="notification-trigger-btn" id="notification-trigger-btn" aria-label="View notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            ${unreadCount > 0 ? '<span class="notification-badge-dot"></span>' : ""}
          </button>
          
          <!-- Dropdown Notification Drawer -->
          <div class="notification-dropdown" id="notification-dropdown">
            <div class="notification-header">
              <h4>System Alerts</h4>
              <button class="btn btn-ghost btn-sm" id="mark-all-read-btn" style="font-size:0.75rem;">Mark all as read</button>
            </div>
            <div class="notification-list" id="notification-list-container">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>

        <!-- User Profile Trigger & Dropdown -->
        <div style="position: relative;">
          <button class="navbar-profile-trigger" id="profile-dropdown-trigger">
            <div class="profile-avatar">${user?.avatar || "VX"}</div>
            <div class="profile-meta">
              <span class="profile-name">${user?.name || "Guest"}</span>
              <span class="profile-role-tag">${user?.role || "Visitor"}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <div class="dropdown-menu" id="profile-dropdown-menu">
            <div style="padding: 0.5rem 0.85rem; border-bottom: 1px solid var(--glass-border-subtle); margin-bottom: 0.25rem;">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--dark-navy);">${user?.name || "User"}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${user?.email || ""}</div>
            </div>
            
            <a class="dropdown-item" href="#${user?.role || "parent"}/dashboard">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              My Dashboard
            </a>

            <div class="glass-divider" style="margin: 0.35rem 0;"></div>
            <div style="padding: 0.2rem 0.85rem; font-size: 0.7rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">
              Switch Demo Portal
            </div>
            <button class="dropdown-item" data-switch-role="admin">
              <span class="macos-dot macos-dot-close" style="width:8px; height:8px;"></span> Health Admin
            </button>
            <button class="dropdown-item" data-switch-role="parent">
              <span class="macos-dot macos-dot-zoom" style="width:8px; height:8px;"></span> Parent Portal
            </button>
            <button class="dropdown-item" data-switch-role="hospital">
              <span class="macos-dot macos-dot-min" style="width:8px; height:8px;"></span> Hospital Portal
            </button>

            <div class="glass-divider" style="margin: 0.35rem 0;"></div>
            <button class="dropdown-item text-danger" id="nav-logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function attachNavbarEvents() {
  // Theme toggle
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      themeService.toggleTheme();
      // Update icon
      const isDark = themeService.isDark();
      themeBtn.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  // Sidebar toggle button with centralized state
  const sidebarBtn = document.getElementById("sidebar-toggle-btn");
  if (sidebarBtn) {
    sidebarBtn.onclick = (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 992) {
        appState.setMobileSidebarOpen(!appState.isMobileSidebarOpen);
      } else {
        appState.toggleSidebarCollapsed();
      }
    };
  }

  // Attach mobile drawer and keyboard events
  attachSidebarEvents();

  // Profile dropdown toggle
  const profileTrigger = document.getElementById("profile-dropdown-trigger");
  const profileMenu = document.getElementById("profile-dropdown-menu");
  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener("click", e => {
      e.stopPropagation();
      profileMenu.classList.toggle("is-open");
    });
  }

  // Notification dropdown toggle
  const notifTrigger = document.getElementById("notification-trigger-btn");
  const notifMenu = document.getElementById("notification-dropdown");
  if (notifTrigger && notifMenu) {
    notifTrigger.addEventListener("click", e => {
      e.stopPropagation();
      notifMenu.classList.toggle("is-open");
      renderNotificationList();
    });
  }

  // Mark all read
  const markAllRead = document.getElementById("mark-all-read-btn");
  if (markAllRead) {
    markAllRead.addEventListener("click", () => {
      notificationService.markAllAsRead();
      renderNotificationList();
      const dot = document.querySelector(".notification-badge-dot");
      if (dot) dot.remove();
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    if (profileMenu) profileMenu.classList.remove("is-open");
    if (notifMenu) notifMenu.classList.remove("is-open");
  });

  // Logout handler
  const logoutBtn = document.getElementById("nav-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      authService.logout();
      window.location.hash = "#landing";
    });
  }

  // Demo switch triggers
  document.querySelectorAll("[data-switch-role]").forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.getAttribute("data-switch-role");
      authService.switchDemoUser(role);
      window.location.hash = `#${role}/dashboard`;
    });
  });
}

function renderNotificationList() {
  const container = document.getElementById("notification-list-container");
  if (!container) return;
  const list = notificationService.getNotifications();

  if (list.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No alerts at this time.</div>`;
    return;
  }

  container.innerHTML = list
    .map(
      n => `
      <div class="notification-item ${n.read ? "" : "unread"}">
        <div class="notification-icon-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
        <div class="notification-content">
          <div class="notification-title">${n.title}</div>
          <div class="notification-desc">${n.message}</div>
          <div class="notification-time">${n.time}</div>
        </div>
      </div>
    `
    )
    .join("");
}
