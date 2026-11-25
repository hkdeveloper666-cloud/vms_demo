/**
 * StorageService
 * Centralized, safe localStorage abstraction with fallback and reactive event propagation
 */
import { STORAGE_KEYS } from "../core/constants.js";
import { mockUsers } from "../data/mockUsers.js";
import { mockVaccines } from "../data/mockVaccines.js";
import { mockHospitals } from "../data/mockHospitals.js";
import { mockChildren } from "../data/mockChildren.js";
import { mockBookings } from "../data/mockBookings.js";
import { eventBus } from "../core/eventBus.js";

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    // If not initialized yet, populate localStorage with realistic mock data
    if (!this.get(STORAGE_KEYS.INITIALIZED)) {
      this.resetToDefaults();
    }
  }

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`[StorageService] Error reading key "${key}":`, e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      eventBus.emit(`storage:${key}`, value);
      return true;
    } catch (e) {
      console.error(`[StorageService] Error saving key "${key}":`, e);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      eventBus.emit(`storage:${key}`, null);
      return true;
    } catch (e) {
      console.error(`[StorageService] Error removing key "${key}":`, e);
      return false;
    }
  }

  resetToDefaults() {
    this.set(STORAGE_KEYS.USERS, mockUsers);
    this.set(STORAGE_KEYS.VACCINES, mockVaccines);
    this.set(STORAGE_KEYS.HOSPITALS, mockHospitals);
    this.set(STORAGE_KEYS.CHILDREN, mockChildren);
    this.set(STORAGE_KEYS.BOOKINGS, mockBookings);
    
    // Seed initial notifications
    const initialNotifications = [
      {
        id: "notif-1",
        title: "Welcome to VAXORA",
        message: "Your pediatric immunization platform is active and ready.",
        time: "Just now",
        read: false,
        type: "info"
      },
      {
        id: "notif-2",
        title: "New Booking Request",
        message: "Fatima Ahmed requested Measles-1 for Rayan Ahmed at Shifa Hospital.",
        time: "10 mins ago",
        read: false,
        type: "warning"
      }
    ];
    this.set(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    this.set(STORAGE_KEYS.INITIALIZED, true);

    eventBus.emit("storage:reset");
  }
}

export const storageService = new StorageService();
