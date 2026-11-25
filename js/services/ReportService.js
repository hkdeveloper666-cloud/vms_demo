/**
 * ReportService
 * Generates Child-wise, Date-wise, and Official Printable Immunization Reports
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS, BOOKING_STATUS } from "../core/constants.js";
import { formatDate, calculateAge } from "../utils/dateUtils.js";

class ReportService {
  /**
   * Child-wise vaccination report data
   */
  getChildWiseReport(childId) {
    const children = storageService.get(STORAGE_KEYS.CHILDREN, []);
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);

    const child = children.find(c => c.id === childId);
    if (!child) return null;

    const childBookings = bookings.filter(b => b.childId === childId);
    const completedDoses = childBookings.filter(b => b.status === BOOKING_STATUS.VACCINATED);
    const pendingDoses = childBookings.filter(b => b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.APPROVED);

    return {
      child,
      age: calculateAge(child.dob),
      totalRecords: childBookings.length,
      completedCount: completedDoses.length,
      records: childBookings
    };
  }

  /**
   * Date-wise vaccination report data
   */
  getDateWiseReport(startDate, endDate) {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []);
    let filtered = bookings;

    if (startDate) {
      filtered = filtered.filter(b => b.appointmentDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(b => b.appointmentDate <= endDate);
    }

    const totalVaccinated = filtered.filter(b => b.status === BOOKING_STATUS.VACCINATED).length;
    const totalPending = filtered.filter(b => b.status === BOOKING_STATUS.PENDING).length;
    const totalApproved = filtered.filter(b => b.status === BOOKING_STATUS.APPROVED).length;

    return {
      startDate,
      endDate,
      totalCount: filtered.length,
      totalVaccinated,
      totalPending,
      totalApproved,
      records: filtered
    };
  }

  /**
   * Generate Printable Official Child Immunization Certificate HTML
   */
  generatePrintablePassport(childId) {
    const report = this.getChildWiseReport(childId);
    if (!report) return `<div class="p-4">Child profile not found.</div>`;

    const { child, records, completedCount, age } = report;

    const rowsHtml = records.map((rec, i) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-weight:600;">#${i + 1}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0;">
          <strong>${rec.vaccineName}</strong>
        </td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0;">${formatDate(rec.appointmentDate)}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0;">${rec.hospitalName}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-family: monospace;">${rec.batchNumber || "—"}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0;">
          <span style="display:inline-block; padding: 3px 8px; border-radius: 99px; font-size:12px; font-weight:700; ${
            rec.status === "Vaccinated"
              ? "background: #D1FAE5; color: #065F46;"
              : rec.status === "Approved"
              ? "background: #DBEAFE; color: #1E40AF;"
              : "background: #FEF3C7; color: #92400E;"
          }">${rec.status}</span>
        </td>
      </tr>
    `).join("");

    return `
      <div class="report-paper">
        <div class="report-header">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
                <path d="M22 4 C32 4 40 9.5 40 19.5 C40 31 25.5 39.5 22 42 C18.5 39.5 4 31 4 19.5 C4 9.5 12 4 22 4 Z" stroke="#5B8DEF" stroke-width="3" fill="#EEF2FF"/>
                <path d="M22 13 L22 27 M15 20 L29 20" stroke="#5B8DEF" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <h2 style="font-size: 22px; margin:0; color:#17233D; letter-spacing:-0.5px;">VAXORA IMMUNIZATION PASSPORT</h2>
            </div>
            <p style="margin: 4px 0 0; font-size: 13px; color:#64748B;">Official Verified Child Health & Vaccination Record</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size: 12px; color:#64748B;">Report Generated</div>
            <div style="font-weight: 700; font-size: 14px; color:#17233D;">${new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}</div>
          </div>
        </div>

        <div class="report-meta-grid">
          <div class="report-meta-item">
            <strong>Child Name</strong>
            <span>${child.name}</span>
          </div>
          <div class="report-meta-item">
            <strong>Date of Birth (Age)</strong>
            <span>${formatDate(child.dob)} (${age})</span>
          </div>
          <div class="report-meta-item">
            <strong>Gender / Blood Group</strong>
            <span>${child.gender} / ${child.bloodGroup}</span>
          </div>
          <div class="report-meta-item">
            <strong>Parent / Guardian</strong>
            <span>${child.parentName} (${child.parentRelation})</span>
          </div>
          <div class="report-meta-item">
            <strong>Emergency Contact</strong>
            <span>${child.emergencyContact}</span>
          </div>
          <div class="report-meta-item">
            <strong>Status</strong>
            <span style="color: ${completedCount >= 10 ? '#059669' : '#2563EB'};">${child.status} (${completedCount} / 10 Doses)</span>
          </div>
        </div>

        <h3 style="font-size: 16px; margin: 20px 0 10px; color:#17233D;">Immunization Records Ledger</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <thead>
            <tr style="background: #F8FAFC; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color:#64748B;">
              <th style="padding: 10px 14px; border-bottom: 2px solid #E2E8F0;">#</th>
              <th style="padding: 10px 14px; border-bottom: 2px solid #E2E8F0;">Vaccine</th>
              <th style="padding: 10px 14px; border-bottom: 2px solid #E2E8F0;">Date</th>
              <th style="padding: 10px 14px; border-bottom: 2px solid #E2E8F0;">Hospital / Center</th>
              <th style="padding: 10px 14px; border-bottom: 2px solid #E2E8F0;">Batch Number</th>
              <th style="padding: 10px 14px; border-bottom: 2px solid #E2E8F0;">Verification</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="6" style="padding: 24px; text-align:center; color:#94A3B8;">No records found.</td></tr>`}
          </tbody>
        </table>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 30px; padding-top: 15px; border-top: 1px dashed #CBD5E1; font-size: 12px; color:#94A3B8;">
          <div>Digitally validated by VAXORA Health Network. System Authenticated.</div>
          <div class="no-print">
            <button class="btn btn-primary btn-sm" onclick="window.print()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Print Official Card
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

export const reportService = new ReportService();
