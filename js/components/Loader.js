/**
 * Loader Component
 * Professional macOS Glassmorphic loading system:
 * 1. Initial application bootstrap loader
 * 2. Route navigation top progress bar
 * 3. Data skeleton placeholders (stat cards, tables, cards)
 * 4. Button loading states with spinner feedback
 */

export const loader = {
  /**
   * Hide initial application loader with smooth fade-out
   */
  hideInitialLoader() {
    const el = document.getElementById("app-initial-loader");
    if (!el) return;
    el.classList.add("fade-out");
    setTimeout(() => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 2000);
  },

  /**
   * Show route transition top progress bar
   */
  showPageLoader() {
    let bar = document.getElementById("page-progress-loader");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "page-progress-loader";
      bar.className = "page-progress-bar";
      document.body.appendChild(bar);
    }
    bar.style.width = "30%";
    bar.style.opacity = "1";
    setTimeout(() => {
      if (bar) bar.style.width = "75%";
    }, 4000);
  },

  /**
   * Complete route transition top progress bar
   */
  hidePageLoader() {
    const bar = document.getElementById("page-progress-loader");
    if (!bar) return;
    bar.style.width = "100%";
    setTimeout(() => {
      bar.style.opacity = "0";
      setTimeout(() => {
        bar.style.width = "0%";
      }, 200);
    }, 200);
  },

  /**
   * Set button loading state
   */
  setButtonLoading(button, isLoading, loadingText = "Processing...") {
    if (!button) return;

    if (isLoading) {
      if (!button.dataset.originalHtml) {
        button.dataset.originalHtml = button.innerHTML;
      }
      button.disabled = true;
      button.classList.add("btn-loading");
      button.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span>${loadingText}</span>
      `;
    } else {
      if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
        delete button.dataset.originalHtml;
      }
      button.disabled = false;
      button.classList.remove("btn-loading");
    }
  },

  /**
   * Skeleton loaders for stat cards
   */
  renderSkeletonStatCards(count = 4) {
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <div class="stat-card skeleton-stat-card">
          <div style="flex:1;">
            <div class="skeleton" style="width: 80px; height: 12px; margin-bottom: 8px;"></div>
            <div class="skeleton" style="width: 60px; height: 28px; margin-bottom: 6px;"></div>
            <div class="skeleton" style="width: 110px; height: 10px;"></div>
          </div>
          <div class="skeleton" style="width: 48px; height: 48px; border-radius: var(--radius-sm);"></div>
        </div>
      `;
    }
    return html;
  },

  /**
   * Skeleton loader for data table
   */
  renderSkeletonTable(columns = 5, rows = 4) {
    let headersHtml = "";
    for (let c = 0; c < columns; c++) {
      headersHtml += `<th><div class="skeleton" style="height: 14px; width: 80%;"></div></th>`;
    }

    let rowsHtml = "";
    for (let r = 0; r < rows; r++) {
      let cellsHtml = "";
      for (let c = 0; c < columns; c++) {
        cellsHtml += `<td><div class="skeleton" style="height: 16px; width: ${60 + (c * 8)}%;"></div></td>`;
      }
      rowsHtml += `<tr>${cellsHtml}</tr>`;
    }

    return `
      <div class="table-responsive">
        <table class="glass-table">
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
  },

  /**
   * Skeleton loader for card grids
   */
  renderSkeletonCards(count = 3) {
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <div class="glass-card">
          <div style="display:flex; gap: 12px; margin-bottom: 1rem;">
            <div class="skeleton" style="width: 48px; height: 48px; border-radius: 50%;"></div>
            <div style="flex:1;">
              <div class="skeleton" style="height: 18px; width: 70%; margin-bottom: 6px;"></div>
              <div class="skeleton" style="height: 12px; width: 45%;"></div>
            </div>
          </div>
          <div class="skeleton" style="height: 8px; border-radius: 4px; margin-bottom: 1rem;"></div>
          <div class="skeleton" style="height: 50px; border-radius: var(--radius-sm); margin-bottom: 1rem;"></div>
          <div style="display:flex; gap: 8px;">
            <div class="skeleton" style="height: 32px; flex:1; border-radius: var(--radius-xs);"></div>
            <div class="skeleton" style="height: 32px; flex:1; border-radius: var(--radius-xs);"></div>
          </div>
        </div>
      `;
    }
    return html;
  }
};
