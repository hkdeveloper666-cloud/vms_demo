/**
 * AdminService
 * High-level orchestration for Admin Dashboard statistics and analytics
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS, BOOKING_STATUS, VACCINE_STATUS } from "../core/constants.js";

class AdminService {
  getDashboardStats() {
    const children = storageService.get(STORAGE_KEYS.CHILDREN, []);
    const hospitals = storageService.get(STORAGE_KEYS.HOSPITALS, []);
    const vaccines = storageService.get(STORAGE_KEYS.VACCINES, []);
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);

    const pendingRequests = bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;
    const completedVaccinations = bookings.filter(b => b.status === BOOKING_STATUS.VACCINATED).length;
    const upcomingVaccinations = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;

    return {
      totalChildren: children.length,
      totalHospitals: hospitals.length,
      totalVaccines: vaccines.length,
      availableVaccines: vaccines.filter(v => v.status === VACCINE_STATUS.AVAILABLE).length,
      pendingRequests,
      totalBookings: bookings.length,
      completedVaccinations,
      upcomingVaccinations
    };
  }

  getAnalyticsData() {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);
    const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    const vaccinatedCounts = [45, 62, 78, 95, 110, 142];
    const pendingCounts = [12, 18, 14, 22, 19, bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length + 20];

    return {
      labels: months,
      vaccinatedCounts,
      pendingCounts
    };
  }
}

export const adminService = new AdminService();
