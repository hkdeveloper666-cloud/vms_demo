/**
 * BookingService
 * Manages appointment requests, admin approvals/rejections, and booking lifecycle
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS, BOOKING_STATUS } from "../core/constants.js";
import { generateId } from "../utils/helpers.js";
import { eventBus } from "../core/eventBus.js";

class BookingService {
  getAllBookings() {
    return storageService.get(STORAGE_KEYS.BOOKINGS, []);
  }

  getBookingById(id) {
    const list = this.getAllBookings();
    return list.find(b => b.id === id || b.bookingId === id) || null;
  }

  getBookingsByParent(parentId) {
    const list = this.getAllBookings();
    return list.filter(b => b.parentId === parentId);
  }

  getBookingsByHospital(hospitalId) {
    const list = this.getAllBookings();
    // Hospital only sees their own appointments
    return list.filter(b => b.hospitalId === hospitalId);
  }

  /**
   * Parent creates a new booking request (status = Pending)
   */
  createBooking({ parentUser, child, hospital, vaccine, appointmentDate, appointmentTime, notes = "" }) {
    const list = this.getAllBookings();
    const count = list.length + 1;
    const bookingCode = `VX-2026-${String(count).padStart(3, "0")}`;

    const newBooking = {
      id: generateId("book"),
      bookingId: bookingCode,
      parentId: parentUser.id,
      parentName: parentUser.name,
      parentEmail: parentUser.email,
      parentPhone: parentUser.phone,
      childId: child.id,
      childName: child.name,
      childDob: child.dob,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      vaccineId: vaccine.id,
      vaccineName: vaccine.name,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      status: BOOKING_STATUS.PENDING,
      notes: notes.trim(),
      batchNumber: "",
      vaccinatedDate: "",
      rejectionReason: "",
      createdAt: new Date().toISOString()
    };

    list.unshift(newBooking);
    storageService.set(STORAGE_KEYS.BOOKINGS, list);

    // Trigger notification for admin
    eventBus.emit("booking:created", newBooking);
    return newBooking;
  }

  /**
   * Admin approves a pending appointment request
   */
  approveBooking(bookingId) {
    const list = this.getAllBookings();
    const index = list.findIndex(b => b.id === bookingId || b.bookingId === bookingId);
    if (index === -1) return null;

    list[index].status = BOOKING_STATUS.APPROVED;
    list[index].approvedAt = new Date().toISOString();

    storageService.set(STORAGE_KEYS.BOOKINGS, list);
    eventBus.emit("booking:updated", list[index]);
    return list[index];
  }

  /**
   * Admin rejects a pending appointment request with reason
   */
  rejectBooking(bookingId, reason = "Clinic scheduling constraint") {
    const list = this.getAllBookings();
    const index = list.findIndex(b => b.id === bookingId || b.bookingId === bookingId);
    if (index === -1) return null;

    list[index].status = BOOKING_STATUS.REJECTED;
    list[index].rejectionReason = reason;
    list[index].rejectedAt = new Date().toISOString();

    storageService.set(STORAGE_KEYS.BOOKINGS, list);
    eventBus.emit("booking:updated", list[index]);
    return list[index];
  }

  filterBookings({ search = "", status = "", hospitalId = "", parentId = "", date = "" } = {}) {
    let list = this.getAllBookings();

    if (hospitalId) {
      list = list.filter(b => b.hospitalId === hospitalId);
    }

    if (parentId) {
      list = list.filter(b => b.parentId === parentId);
    }

    if (status && status !== "all") {
      list = list.filter(b => b.status.toLowerCase() === status.toLowerCase());
    }

    if (date) {
      list = list.filter(b => b.appointmentDate === date);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        b =>
          b.bookingId.toLowerCase().includes(q) ||
          b.childName.toLowerCase().includes(q) ||
          b.parentName.toLowerCase().includes(q) ||
          b.hospitalName.toLowerCase().includes(q) ||
          b.vaccineName.toLowerCase().includes(q)
      );
    }

    return list;
  }
}

export const bookingService = new BookingService();
