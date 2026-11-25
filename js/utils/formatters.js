/**
 * Formatting and badge rendering helpers
 */
import { BOOKING_STATUS, VACCINE_STATUS } from "../core/constants.js";

export function formatStatusBadge(status) {
  switch (status) {
    case BOOKING_STATUS.APPROVED:
      return `<span class="glass-pill glass-pill-primary"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Approved</span>`;
    case BOOKING_STATUS.VACCINATED:
      return `<span class="glass-pill glass-pill-success"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Vaccinated</span>`;
    case BOOKING_STATUS.PENDING:
      return `<span class="glass-pill glass-pill-warning"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Pending</span>`;
    case BOOKING_STATUS.REJECTED:
    case BOOKING_STATUS.NOT_VACCINATED:
      return `<span class="glass-pill glass-pill-danger"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> ${status}</span>`;
    case VACCINE_STATUS.AVAILABLE:
      return `<span class="glass-pill glass-pill-success">Available</span>`;
    case VACCINE_STATUS.UNAVAILABLE:
      return `<span class="glass-pill glass-pill-danger">Unavailable</span>`;
    default:
      return `<span class="glass-pill">${status || "Unknown"}</span>`;
  }
}

export function formatPhoneNumber(phone) {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("03")) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
}
