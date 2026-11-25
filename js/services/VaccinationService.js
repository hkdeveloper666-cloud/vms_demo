/**
 * VaccinationService
 * Manages clinical status updates by hospitals and synchronizes child immunization records
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS, BOOKING_STATUS } from "../core/constants.js";
import { eventBus } from "../core/eventBus.js";

class VaccinationService {
  /**
   * Hospital updates the vaccine status to Vaccinated / Completed
   */
  markAsVaccinated(bookingId, { batchNumber = "VAC-2026-LOT", notes = "", administeredDate = "" } = {}) {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);
    const index = bookings.findIndex(b => b.id === bookingId || b.bookingId === bookingId);
    if (index === -1) return null;

    const b = bookings[index];
    b.status = BOOKING_STATUS.VACCINATED;
    b.batchNumber = batchNumber.trim();
    b.vaccinatedDate = administeredDate || new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
    b.notes = notes.trim() || b.notes;

    storageService.set(STORAGE_KEYS.BOOKINGS, bookings);

    // Update child's doses count
    const children = storageService.get(STORAGE_KEYS.CHILDREN, []);
    const childIndex = children.findIndex(c => c.id === b.childId);
    if (childIndex !== -1) {
      children[childIndex].completedDoses = (children[childIndex].completedDoses || 0) + 1;
      if (children[childIndex].completedDoses >= (children[childIndex].totalRequiredDoses || 10)) {
        children[childIndex].status = "Fully Vaccinated";
      } else {
        children[childIndex].status = "Partially Vaccinated";
      }
      storageService.set(STORAGE_KEYS.CHILDREN, children);
    }

    // Update hospital doses count
    const hospitals = storageService.get(STORAGE_KEYS.HOSPITALS, []);
    const hospIndex = hospitals.findIndex(h => h.id === b.hospitalId);
    if (hospIndex !== -1) {
      hospitals[hospIndex].totalDosesAdministered = (hospitals[hospIndex].totalDosesAdministered || 0) + 1;
      storageService.set(STORAGE_KEYS.HOSPITALS, hospitals);
    }

    eventBus.emit("vaccination:completed", b);
    return b;
  }

  /**
   * Hospital updates status to Not Vaccinated / Missed
   */
  markAsNotVaccinated(bookingId, { reason = "Patient could not attend or had acute illness fever." } = {}) {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);
    const index = bookings.findIndex(b => b.id === bookingId || b.bookingId === bookingId);
    if (index === -1) return null;

    const b = bookings[index];
    b.status = BOOKING_STATUS.NOT_VACCINATED;
    b.notes = `Not Vaccinated: ${reason.trim()}`;
    b.updatedAt = new Date().toISOString();

    storageService.set(STORAGE_KEYS.BOOKINGS, bookings);
    eventBus.emit("vaccination:missed", b);
    return b;
  }

  /**
   * Get all completed vaccination records for a child
   */
  getVaccinationHistoryForChild(childId) {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);
    return bookings.filter(b => b.childId === childId && b.status === BOOKING_STATUS.VACCINATED);
  }
}

export const vaccinationService = new VaccinationService();
