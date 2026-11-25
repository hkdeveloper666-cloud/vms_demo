/**
 * Landing Page Feature
 * Premium macOS Glassmorphism Showcase with Hero, 3 Portal Selection Cards, Features, Workflow, and CTA
 */
import { themeService } from "../services/ThemeService.js";
import { storageService } from "../services/StorageService.js";
import { notificationService } from "../services/NotificationService.js";

export function renderLandingPage() {
  const isDark = themeService.isDark();

  return `
    <div class="landing-page">
      <!-- Ambient Gradient Mesh Background -->
      <div style="position:fixed; inset:0; pointer-events:none; z-index:0; opacity:0.75;">
        <img src="assets/svg/decorations/glass-mesh.svg" alt="" style="width:100%; height:100%; object-fit:cover;">
      </div>

      <!-- Landing Navigation Bar -->
      <header class="landing-navbar" style="position:relative; z-index:10;">
        <div style="display:flex; align-items:center; gap: 12px;">
          <div class="macos-traffic-lights" style="margin-right:4px;">
            <span class="macos-dot macos-dot-close"></span>
            <span class="macos-dot macos-dot-min"></span>
            <span class="macos-dot macos-dot-zoom"></span>
          </div>
          <a href="#landing" style="display:flex; align-items:center;">
            <svg width="150" height="36" viewBox="0 0 240 60" fill="none">
              <path d="M24 4 C34 4 42 9.5 42 19.5 C42 31 27.5 39.5 24 42 C20.5 39.5 6 31 6 19.5 C6 9.5 14 4 24 4 Z" stroke="#5B8DEF" stroke-width="2.5" fill="rgba(91, 141, 239, 0.15)"/>
              <path d="M24 12 L24 28 M16 20 L32 20" stroke="#5B8DEF" stroke-width="3" stroke-linecap="round"/>
              <circle cx="24" cy="20" r="3.5" fill="#FFF"/>
              <text x="64" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-size="25" font-weight="800" fill="currentColor">
                VAX<tspan fill="#5B8DEF">ORA</tspan>
              </text>
              <text x="65" y="48" font-family="Inter, sans-serif" font-size="8.5" font-weight="600" letter-spacing="2" fill="#8E9CB2">
                IMMUNIZATION OS
              </text>
            </svg>
          </a>
        </div>

        <nav class="landing-nav-links">
          <a href="#portals" class="landing-nav-link">Portals</a>
          <a href="#features" class="landing-nav-link">Features</a>
          <a href="#how-it-works" class="landing-nav-link">How It Works</a>
          <a href="#benefits" class="landing-nav-link">Clinical Benefits</a>
        </nav>

        <div style="display:flex; align-items:center; gap: 10px;">
          <!-- Reset Demo Data Button -->
          <button class="btn btn-secondary btn-sm" id="btn-reset-demo" title="Reset mock data in localStorage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
            Reset Demo Data
          </button>

          <!-- Theme Toggle -->
          <button class="theme-toggle-btn" id="landing-theme-toggle" title="Toggle Theme" aria-label="Toggle Theme">
            ${
              isDark
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
            }
          </button>

          <!-- Get Started CTA -->
          <a href="#login-parent" class="btn btn-primary btn-sm">
            Access Portals
          </a>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section" style="position:relative; z-index:5;">
        <div class="hero-content">
          <div class="hero-pill-badge">
            <span class="macos-dot macos-dot-zoom" style="width:8px; height:8px;"></span>
            Next-Gen Pediatric Immunization Platform
          </div>

          <h1 class="hero-title">
            Safeguarding Every Child with <span class="gradient-text">Precision Health.</span>
          </h1>

          <p class="hero-description">
            VAXORA is a modern immunization management operating system connecting health administrators, accredited hospitals, and parents in one unified glassmorphic workspace.
          </p>

          <div class="hero-cta-group">
            <a href="#portals" class="btn btn-primary btn-lg">
              Explore 3 Portals
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
            <a href="#login-admin" class="btn btn-secondary btn-lg">
              Admin Surveillance
            </a>
          </div>

          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <h3 style="color:var(--primary);">100%</h3>
              <p>EPI & WHO Compliant</p>
            </div>
            <div class="hero-stat-item">
              <h3 style="color:var(--secondary);">12+</h3>
              <p>EPI Vaccines Monitored</p>
            </div>
            <div class="hero-stat-item">
              <h3 style="color:var(--status-success-text);">0-15 Yrs</h3>
              <p>Lifespan Coverage</p>
            </div>
          </div>
        </div>

        <!-- Hero Visual (SVG Medical Illustration) -->
        <div class="hero-visual animate-float">
          <img src="assets/svg/illustrations/medical-hero.svg" alt="VAXORA Medical Immunization Platform" style="max-height: 480px; width: 100%;">
        </div>
      </section>

      <!-- Three Portals Section -->
      <section id="portals" class="portals-section" style="position:relative; z-index:5;">
        <div class="section-header-center">
          <span class="glass-pill glass-pill-primary" style="margin-bottom:0.75rem;">Role-Based Architecture</span>
          <h2>Select Your Dedicated Portal</h2>
          <p>VAXORA features specialized interfaces custom-tailored for health directors, registered parents, and clinical hospital staff.</p>
        </div>

        <div class="portals-grid">
          <!-- 1. Admin Portal Card -->
          <div class="portal-selection-card portal-card-admin">
            <div>
              <div class="portal-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 class="portal-card-title">Health Admin Portal</h3>
              <p class="portal-card-desc">
                Centralized command for national vaccine surveillance, parent appointment approvals, and clinical hospital audits.
              </p>

              <div class="portal-features-list">
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> All Child Details & Profiles
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Approve / Reject Parent Requests
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Vaccine Formulation Catalog CRUD
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Add, Edit & Audit Hospitals
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Child-wise & Date-wise Reports
                </div>
              </div>
            </div>

            <a href="#login-admin" class="btn btn-primary" style="width:100%;">
              Launch Admin Portal →
            </a>
          </div>

          <!-- 2. Parent Portal Card -->
          <div class="portal-selection-card portal-card-parent" style="border-color: rgba(167, 139, 250, 0.4);">
            <div>
              <div class="portal-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 class="portal-card-title">Parent / Guardian Portal</h3>
              <p class="portal-card-desc">
                Effortlessly maintain your child's immunization passport, view upcoming milestone dates, and request hospital slots.
              </p>

              <div class="portal-features-list">
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Multi-Child Profile Management
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Schedule Timeline & Due Alerts
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Search & Book Hospital Centers
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Real-Time Request Status Tracking
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Printable Official Health Passport
                </div>
              </div>
            </div>

            <a href="#login-parent" class="btn btn-lavender" style="width:100%;">
              Launch Parent Portal →
            </a>
          </div>

          <!-- 3. Hospital Portal Card -->
          <div class="portal-selection-card portal-card-hospital">
            <div>
              <div class="portal-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 9h6"></path><path d="M9 13h6"></path><path d="M9 17h6"></path></svg>
              </div>
              <h3 class="portal-card-title">Hospital Clinic Portal</h3>
              <p class="portal-card-desc">
                Manage appointment queues approved by health administration, administer doses, and verify vaccine batch lot numbers.
              </p>

              <div class="portal-features-list">
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Approved Appointment Queue
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Patient Child & Parent Dossier
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Mark "Vaccinated" with Batch #
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Record Reasons for Missed Doses
                </div>
                <div class="portal-feature-item">
                  <span class="portal-feature-icon">✓</span> Center Throughput Analytics
                </div>
              </div>
            </div>

            <a href="#login-hospital" class="btn btn-success" style="width:100%;">
              Launch Hospital Portal →
            </a>
          </div>
        </div>
      </section>

      <!-- Key Features Section -->
      <section id="features" class="features-section" style="position:relative; z-index:5;">
        <div class="section-header-center">
          <span class="glass-pill glass-pill-primary" style="margin-bottom:0.75rem;">Engineered for Reliability</span>
          <h2>Intelligent Immunization Features</h2>
          <p>Eliminate missed vaccination doses and fragmented paper cards with certified digital infrastructure.</p>
        </div>

        <div class="features-grid">
          <div class="feature-box">
            <div style="font-size:2rem; margin-bottom:0.75rem;">🛡️</div>
            <h4 style="margin-bottom:0.4rem; color:var(--dark-navy);">macOS Glassmorphism</h4>
            <p class="text-sm">Ultra-modern UI featuring frosted glass cards, fluid typography, subtle glowing meshes, and responsive layouts.</p>
          </div>

          <div class="feature-box">
            <div style="font-size:2rem; margin-bottom:0.75rem;">⚡</div>
            <h4 style="margin-bottom:0.4rem; color:var(--dark-navy);">Regex Form Engine</h4>
            <p class="text-sm">Strict validation enforcing valid names, RFC emails, complex passwords, and Pakistan standard phone formats.</p>
          </div>

          <div class="feature-box">
            <div style="font-size:2rem; margin-bottom:0.75rem;">📋</div>
            <h4 style="margin-bottom:0.4rem; color:var(--dark-navy);">End-to-End Workflow</h4>
            <p class="text-sm">Parent submits request → Admin approves → Hospital administers dose → Parent gets verified digital certificate.</p>
          </div>

          <div class="feature-box">
            <div style="font-size:2rem; margin-bottom:0.75rem;">🖨️</div>
            <h4 style="margin-bottom:0.4rem; color:var(--dark-navy);">Printable Child Passport</h4>
            <p class="text-sm">Generate printable official vaccination certificates with batch numbers for school admissions and international travel.</p>
          </div>

          <div class="feature-box">
            <div style="font-size:2rem; margin-bottom:0.75rem;">🔔</div>
            <h4 style="margin-bottom:0.4rem; color:var(--dark-navy);">Real-time Alerts & Toasts</h4>
            <p class="text-sm">Instant floating alerts and in-app notification drawers keep guardians and doctors informed at every milestone.</p>
          </div>

          <div class="feature-box">
            <div style="font-size:2rem; margin-bottom:0.75rem;">🌓</div>
            <h4 style="margin-bottom:0.4rem; color:var(--dark-navy);">Light & Dark Themes</h4>
            <p class="text-sm">Seamlessly switch between crisp light glass and deep navy dark mode with persistent user preferences.</p>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="steps-section" style="position:relative; z-index:5;">
        <div class="section-header-center">
          <span class="glass-pill glass-pill-primary" style="margin-bottom:0.75rem;">Simulated Architecture</span>
          <h2>How VAXORA Works</h2>
          <p>A seamless, cooperative cycle designed to prevent vaccine delays and maintain verifiable immunization records.</p>
        </div>

        <div class="steps-timeline-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <h4 style="margin-bottom:0.5rem; color:var(--dark-navy);">Add Child Profile</h4>
            <p class="text-sm">Parent registers infant details, birth date, blood group, allergies, and emergency contact numbers.</p>
          </div>

          <div class="step-card">
            <div class="step-number">2</div>
            <h4 style="margin-bottom:0.5rem; color:var(--dark-navy);">Request Appointment</h4>
            <p class="text-sm">Parent searches accredited hospitals, selects vaccine formulation, date, and preferred time slot.</p>
          </div>

          <div class="step-card">
            <div class="step-number">3</div>
            <h4 style="margin-bottom:0.5rem; color:var(--dark-navy);">Admin Approves</h4>
            <p class="text-sm">Health surveillance admin reviews the pending booking, confirms allocation, and dispatches to hospital.</p>
          </div>

          <div class="step-card">
            <div class="step-number">4</div>
            <h4 style="margin-bottom:0.5rem; color:var(--dark-navy);">Clinical Verification</h4>
            <p class="text-sm">Hospital clinic administers vaccine, logs lot batch number, and updates the child's immunization passport.</p>
          </div>
        </div>
      </section>

      <!-- Call to Action Banner -->
      <section class="portals-section" style="position:relative; z-index:5;">
        <div class="welcome-hero-card" style="text-align:center; flex-direction:column; padding: 3.5rem 2rem;">
          <h2 style="font-size:2.2rem; margin-bottom:0.5rem;">Ready to Experience VAXORA?</h2>
          <p style="margin-bottom:1.5rem; max-width:600px;">
            Explore the complete system using our pre-configured demo accounts for Admin, Parent, and Hospital roles with one click.
          </p>
          <div style="display:flex; gap:1rem; flex-wrap:wrap; justify-content:center;">
            <a href="#login-parent" class="btn btn-primary btn-lg">Sign in as Parent</a>
            <a href="#login-admin" class="btn btn-lavender btn-lg">Sign in as Admin</a>
            <a href="#login-hospital" class="btn btn-success btn-lg">Sign in as Hospital</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer" style="position:relative; z-index:5;">
        <div class="footer-content">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="macos-dot macos-dot-zoom" style="width:10px; height:10px;"></span>
            <strong>VAXORA Immunization Management System</strong>
          </div>
          <div class="text-sm" style="color:var(--text-muted);">
            Frontend Architecture Demo • Built with HTML5, CSS3 & Vanilla JavaScript ES6
          </div>
          <div style="font-size:0.8rem; color:var(--text-light);">
            © 2026 VAXORA Healthcare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function attachLandingEvents() {
  const themeBtn = document.getElementById("landing-theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      themeService.toggleTheme();
      const isDark = themeService.isDark();
      themeBtn.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  // Reset demo data button
  const resetBtn = document.getElementById("btn-reset-demo");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset mock database back to initial seed data?")) {
        storageService.resetToDefaults();
        notificationService.showToast("Mock database restored to defaults!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    });
  }
}
