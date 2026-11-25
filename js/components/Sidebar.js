/**
 * Sidebar Component
 * macOS Glass Sidebar with role-based navigation, state persistence, and mobile off-canvas drawer
 */
import { appState } from "../core/state.js";
import { bookingService } from "../services/BookingService.js";
import { ROLES, BOOKING_STATUS } from "../core/constants.js";

export function renderSidebar(activeNav = "dashboard") {
  const user = appState.getCurrentUser();
  const role = user?.role || ROLES.PARENT;

  // Sync body class with appState
  const isDesktop = window.innerWidth > 992;
  const isCollapsed = appState.isSidebarCollapsed && isDesktop;
  if (isCollapsed) {
    document.body.classList.add("sidebar-collapsed");
  } else {
    document.body.classList.remove("sidebar-collapsed");
  }

  // Pending count for Admin badge
  const pendingCount = bookingService
    .getAllBookings()
    .filter(b => b.status === BOOKING_STATUS.PENDING).length;

  let navItems = [];

  if (role === ROLES.ADMIN) {
    navItems = [
      { id: "dashboard", label: "Dashboard", hash: "#admin/dashboard", icon: `<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>` },
      { id: "children", label: "All Child Details", hash: "#admin/children", icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>` },
      { id: "schedule", label: "Vaccination Dates", hash: "#admin/schedule", icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>` },
      { id: "reports", label: "Report of Vaccination", hash: "#admin/reports", icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>` },
      { id: "vaccines", label: "List of Vaccines", hash: "#admin/vaccines", icon: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>` },
      { id: "requests", label: "Requests from Parents", hash: "#admin/requests", icon: `<path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>`, badge: pendingCount > 0 ? pendingCount : null },
      { id: "hospitals", label: "List of Hospitals", hash: "#admin/hospitals", icon: `<path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 9h6"></path><path d="M9 13h6"></path><path d="M9 17h6"></path>` },
      { id: "bookings", label: "Booking Details", hash: "#admin/bookings", icon: `<path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>` }
    ];
  } else if (role === ROLES.PARENT) {
    navItems = [
      { id: "dashboard", label: "Dashboard", hash: "#parent/dashboard", icon: `<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>` },
      { id: "children", label: "Details of Child", hash: "#parent/children", icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>` },
      { id: "schedule", label: "Vaccination Dates", hash: "#parent/schedule", icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>` },
      { id: "book", label: "Book Hospital", hash: "#parent/book", icon: `<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>` },
      { id: "requests", label: "Request Status", hash: "#parent/requests", icon: `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>` },
      { id: "history", label: "Vaccination Taken Report", hash: "#parent/history", icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>` },
      { id: "profile", label: "My Profile", hash: "#parent/profile", icon: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>` }
    ];
  } else if (role === ROLES.HOSPITAL) {
    navItems = [
      { id: "dashboard", label: "Hospital Dashboard", hash: "#hospital/dashboard", icon: `<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>` },
      { id: "appointments", label: "Appointment Queue", hash: "#hospital/appointments", icon: `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>` },
      { id: "status", label: "Update Vaccine Status", hash: "#hospital/status", icon: `<polyline points="20 6 9 17 4 12"></polyline>` }
    ];
  }

  const navItemsHtml = navItems
    .map(item => {
      const isActive = item.id === activeNav;
      return `
        <a class="nav-item ${isActive ? "active" : ""}" href="${item.hash}" data-nav-id="${item.id}" title="${item.label}">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              ${item.icon}
            </svg>
          </div>
          <span class="nav-text">${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ""}
        </a>
      `;
    })
    .join("");

  return `
    <!-- Semi-transparent Mobile Drawer Backdrop -->
    <div class="sidebar-backdrop" id="sidebar-backdrop" aria-hidden="true"></div>

    <aside class="app-sidebar ${isCollapsed ? "is-collapsed" : ""}" id="app-sidebar" aria-label="Sidebar navigation">
      <!-- Sidebar Header with Brand & macOS Traffic Lights -->
      <div class="sidebar-header">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div class="macos-traffic-lights">
            <span class="macos-dot macos-dot-close" title="Close Window"></span>
            <span class="macos-dot macos-dot-min" title="Minimize Window"></span>
            <span class="macos-dot macos-dot-zoom" title="Zoom Window"></span>
          </div>
          <a class="sidebar-brand" href="#${role}/dashboard">
            <span class="sidebar-brand-text">VAX<span style="color:var(--primary)">ORA</span></span>
            <span class="sidebar-brand-badge">${role}</span>
          </a>
        </div>

        <!-- Mobile Drawer Close Button -->
        <button class="sidebar-mobile-close" id="sidebar-mobile-close" aria-label="Close navigation menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav" aria-label="Main Navigation">
        <div class="nav-section-title">Main Navigation</div>
        ${navItemsHtml}
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <a class="nav-item" href="#landing" style="font-size:0.85rem; color: var(--text-muted);">
          <div class="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span class="nav-text">Back to Home</span>
        </a>
      </div>
    </aside>
  `;
}

/**
 * Attach centralized sidebar events
 */
export function attachSidebarEvents() {
  const backdrop = document.getElementById("sidebar-backdrop");
  const mobileClose = document.getElementById("sidebar-mobile-close");
  const navItems = document.querySelectorAll(".app-sidebar .nav-item");

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      appState.setMobileSidebarOpen(false);
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", () => {
      appState.setMobileSidebarOpen(false);
    });
  }

  // Auto close mobile drawer on link click
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        appState.setMobileSidebarOpen(false);
      }
    });
  });

  // Escape key closes mobile drawer
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && appState.isMobileSidebarOpen) {
      appState.setMobileSidebarOpen(false);
    }
  });

  // Window resize handler
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      if (appState.isMobileSidebarOpen) {
        appState.setMobileSidebarOpen(false);
      }
      // Re-apply desktop collapsed preference
      if (appState.isSidebarCollapsed) {
        document.body.classList.add("sidebar-collapsed");
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar) sidebar.classList.add("is-collapsed");
      }
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }
  });
}
