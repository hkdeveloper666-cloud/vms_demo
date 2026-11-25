/**
 * DataTable Component
 * Reusable table with responsive wrapper, glass styling, and empty state
 */

export function renderDataTable({ columns, rows, emptyMessage = "No records found" }) {
  if (!rows || rows.length === 0) {
    return `
      <div class="glass-container" style="padding: 3rem 1.5rem; text-align: center;">
        <div class="table-empty-icon">📂</div>
        <h4 style="color: var(--dark-navy); margin-bottom: 0.35rem;">Nothing to display</h4>
        <p class="text-sm">${emptyMessage}</p>
      </div>
    `;
  }

  const thHtml = columns.map(col => `<th>${col.title}</th>`).join("");

  const tbodyHtml = rows
    .map(row => {
      const tdHtml = columns.map(col => `<td>${col.render ? col.render(row) : row[col.key] || "—"}</td>`).join("");
      return `<tr>${tdHtml}</tr>`;
    })
    .join("");

  return `
    <div class="glass-container table-responsive">
      <table class="glass-table">
        <thead>
          <tr>${thHtml}</tr>
        </thead>
        <tbody>
          ${tbodyHtml}
        </tbody>
      </table>
    </div>
  `;
}
