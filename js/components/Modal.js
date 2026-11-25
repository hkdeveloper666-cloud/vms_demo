/**
 * Modal Component
 * macOS Frosted Glass Sheet & Dialog System
 */

class ModalController {
  constructor() {
    this.activeModal = null;
    this.initKeyListeners();
  }

  initKeyListeners() {
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && this.activeModal) {
        this.close();
      }
    });
  }

  /**
   * Open a glassmorphic modal
   */
  open({ title = "Dialog", bodyHtml = "", footerHtml = "", size = "" }) {
    this.close(); // Close any currently open modal

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "vaxora-modal-backdrop";

    backdrop.innerHTML = `
      <div class="modal-dialog ${size ? `modal-${size}` : ""}" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-wrapper">
            <div class="macos-traffic-lights" style="padding:0; margin-right:4px;">
              <span class="macos-dot macos-dot-close" style="width:10px; height:10px;"></span>
              <span class="macos-dot macos-dot-min" style="width:10px; height:10px;"></span>
              <span class="macos-dot macos-dot-zoom" style="width:10px; height:10px;"></span>
            </div>
            <h3 class="modal-title">${title}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body" id="modal-body-content">
          ${bodyHtml}
        </div>
        ${footerHtml ? `<div class="modal-footer" id="modal-footer-content">${footerHtml}</div>` : ""}
      </div>
    `;

    document.body.appendChild(backdrop);
    this.activeModal = backdrop;

    // Trigger opening animation
    requestAnimationFrame(() => {
      backdrop.classList.add("is-open");
    });

    // Close button click
    backdrop.querySelector("#modal-close-btn").addEventListener("click", () => this.close());

    // Backdrop click outside dialog
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) {
        this.close();
      }
    });

    return backdrop;
  }

  close() {
    if (!this.activeModal) return;
    const modal = this.activeModal;
    modal.classList.remove("is-open");
    setTimeout(() => {
      modal.remove();
    }, 250);
    this.activeModal = null;
  }
}

export const modal = new ModalController();
