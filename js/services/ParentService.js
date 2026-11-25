/**
 * ParentService
 * Aggregates statistics, child status summaries, and alerts for Parent Portal
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS, BOOKING_STATUS } from "../core/constants.js";

class ParentService {
  getParentDashboardStats(parentUserId) {
    const children = storageService.get(STORAGE_KEYS.CHILDREN, []).filter(c => c.parentId === parentUserId);
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []).filter(b => b.parentId === parentUserId);

    const upcomingVaccinations = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
    const completedVaccinations = bookings.filter(b => b.status === BOOKING_STATUS.VACCINATED).length;
    const pendingAppointments = bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;

    return {
      totalChildren: children.length,
      upcomingVaccinations,
      completedVaccinations,
      pendingAppointments,
      children,
      recentBookings: bookings.slice(0, 5)
    };
  }

  getNextUpcomingReminder(parentUserId) {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []).filter(
      b => b.parentId === parentUserId && b.status === BOOKING_STATUS.APPROVED
    );

    if (bookings.length === 0) return null;

    // Sort by appointment date ascending
    bookings.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    return bookings[0];
  }
}

export const parentService = new ParentService();
