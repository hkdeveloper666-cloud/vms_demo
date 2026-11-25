/**
 * NotificationService
 * Manages in-app notifications, toasts, and real-time alerts
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS } from "../core/constants.js";
import { appState } from "../core/state.js";
import { generateId } from "../utils/helpers.js";
import { eventBus } from "../core/eventBus.js";

class NotificationService {
  constructor() {
    this.initListeners();
  }

  initListeners() {
    eventBus.on("booking:created", booking => {
      this.addNotification({
        title: "New Appointment Request",
        message: `${booking.parentName} requested ${booking.vaccineName} for ${booking.childName} at ${booking.hospitalName}.`,
        type: "info"
      });
    });

    eventBus.on("booking:updated", booking => {
      if (booking.status === "Approved") {
        this.addNotification({
          title: "Appointment Approved",
          message: `Booking ${booking.bookingId} for ${booking.childName} has been approved by Health Admin.`,
          type: "success"
        });
      } else if (booking.status === "Rejected") {
        this.addNotification({
          title: "Appointment Rejected",
          message: `Booking ${booking.bookingId} was rejected: ${booking.rejectionReason}`,
          type: "warning"
        });
      }
    });

    eventBus.on("vaccination:completed", booking => {
      this.addNotification({
        title: "Vaccination Administered",
        message: `${booking.childName} successfully received ${booking.vaccineName} at ${booking.hospitalName}. Batch: ${booking.batchNumber}.`,
        type: "success"
      });
    });
  }

  getNotifications() {
    return storageService.get(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  getUnreadCount() {
    const list = this.getNotifications();
    return list.filter(n => !n.read).length;
  }

  addNotification({ title, message, type = "info" }) {
    const list = this.getNotifications();
    const newNotif = {
      id: generateId("notif"),
      title,
      message,
      time: "Just now",
      read: false,
      type
    };

    list.unshift(newNotif);
    // Keep max 20
    if (list.length > 20) list.pop();

    storageService.set(STORAGE_KEYS.NOTIFICATIONS, list);
    appState.setUnreadNotificationsCount(this.getUnreadCount());
    eventBus.emit("notification:new", newNotif);

    // Show toast
    this.showToast(message, type);
    return newNotif;
  }

  markAllAsRead() {
    const list = this.getNotifications();
    list.forEach(n => (n.read = true));
    storageService.set(STORAGE_KEYS.NOTIFICATIONS, list);
    appState.setUnreadNotificationsCount(0);
    eventBus.emit("notifications:read");
  }

  showToast(message, type = "info", duration = 4000) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else if (type === "warning") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B8DEF" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="flex-shrink:0;">${iconSvg}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close-btn" aria-label="Close">&times;</button>
    `;

    toast.querySelector(".toast-close-btn").addEventListener("click", () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

export const notificationService = new NotificationService();
