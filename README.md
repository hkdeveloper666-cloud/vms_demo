# VAXORA — Premium Vaccine Management System

> **A Next-Generation Pediatric Immunization & Healthcare Platform**  
> Designed with an exquisite macOS-inspired Glassmorphism interface, modular Vanilla JavaScript (ES6+) service architecture, and strict Regex form validation.

---

## 🌟 Overview & Brand Identity

**VAXORA** is a multi-role healthcare and pediatric immunization platform connecting **Health Surveillance Administrators**, **Accredited Hospitals**, and **Parents/Guardians** into a unified, secure, and reactive glassmorphism workspace.

### Core Value Proposition:
- **EPI & WHO Guidelines:** Complete childhood immunization tracking from birth (BCG, HepB) through 15 years (DTP, MMR, Typhoid).
- **macOS Glassmorphism:** Frosted glass panels (`backdrop-filter: blur(20px)`), multi-layered ambient gradients, macOS traffic light window controls, subtle glow borders, and floating responsive cards.
- **Service-Oriented Architecture:** Frontend-only architecture with independent, swappable ES6 service modules (`AuthService`, `BookingService`, `ChildService`, `VaccineService`, `HospitalService`, `VaccinationService`, `NotificationService`, `ValidationService`, `ReportService`, `StorageService`, `ThemeService`).
- **End-to-End Simulation Workflow:**
  1. Parent registers and adds child profile.
  2. Parent searches accredited hospitals and submits vaccination appointment request.
  3. Health Admin reviews pending request and approves or rejects with reason.
  4. Approved appointment dynamically routes to the Hospital Clinic's queue.
  5. Hospital administers vaccine, logs manufacturer batch lot number, and updates status to **Vaccinated**.
  6. The child's medical passport and parent dashboard dynamically update with verified immunization status!

---

## 🚀 Portals & Functional Modules

### 1. 🛡️ Health Admin Portal
- **Admin Dashboard:** Surveillance metrics (7 statistics cards: Total Registered Children, Total Hospitals, Total Vaccines, Pending Parent Requests, Total Bookings, Completed Vaccinations, Upcoming Vaccinations), monthly distribution analytics line chart (Chart.js), upcoming appointments queue, recent booking table.
- **All Child Details:** Searchable registry of all registered infants, filtered by gender and immunization status, complete modal child dossiers.
- **Date & Time of Vaccination:** Comprehensive schedule ledger filtering appointments by date, hospital, and status.
- **Report of Vaccination:** Child-wise medical ledgers, date-wise reconciliation reports, and printable official certificates.
- **List of Vaccines:** Full CRUD for vaccine catalog with age guidelines, dose counts, and one-click Available / Unavailable status toggling.
- **Requests from Parents:** Real-time evaluation of pending appointments with **Approve** and **Reject** (with reason modal) actions.
- **Add / Update / Delete Hospital:** Healthcare center accreditation, contact details, geo coordinates, and search.
- **Booking Details:** Master appointment ledger with search, status filters, and detailed inspection modal.

### 2. 👨‍👩‍👦 Parent / Guardian Portal
- **Parent Dashboard:** Welcome hero card, circular quick action pills (matches reference design), 4 stat cards, child progress bars, next due appointment alerts.
- **Details of Child:** Add and edit child profiles (full name, DOB, gender, blood group, parent relationship, emergency phone, allergies, pediatric notes).
- **Vaccination Dates:** Interactive timeline of the child's immunization milestones with age groups and booking links.
- **Book Hospital & Appointment Requests:** Search accredited hospitals by city, select child, choose vaccine, pick date (future validation), select time slot, and submit.
- **Request Status Tracker:** Real-time monitoring of appointment status across **Pending**, **Approved**, **Vaccinated**, and **Rejected** states.
- **Vaccination History & Passport:** Verified ledger of all administered doses with batch tracking and printable official Child Health Card.
- **My Profile:** Update guardian information, contact numbers, and verified home address.

### 3. 🏥 Hospital Provider Portal
- **Hospital Dashboard:** Clinic overview with 4 stat cards (Total Appointments, Pending Approval, Upcoming Appointments, Completed Vaccinations) and daily queue.
- **Appointment Management:** Dedicated queue of appointments approved by Health Admin for this facility.
- **Update Vaccine Status:** Clinical verification modal to mark patient as **Vaccinated / Completed** (recording vaccine batch lot number and nurse notes) or **Not Vaccinated** (with clinical reasons like high fever or missed appointment).

---

## 🎨 Design System & macOS Glassmorphism

- **Color Palette:**
  - Primary Blue: `#5B8DEF`
  - Secondary Lavender: `#A78BFA`
  - Dark Navy: `#17233D`
  - Light Background: `#F3F6FC`
  - Glass Background: `rgba(255, 255, 255, 0.68)` with `backdrop-filter: blur(20px)`
  - Dark Glass Background: `rgba(17, 24, 39, 0.72)` with `rgba(255, 255, 255, 0.12)` border
- **macOS Aesthetic:** Window controls (traffic light dots: red `#FF5F56`, yellow `#FFBD2E`, green `#27C93F`), smooth frosted glass cards, pill action buttons, and glowing hover states.
- **Themes:** Complete Light and Dark Mode with instant toggle and `localStorage` persistence.
- **Animations:** Floating keyframes, card entrance transitions, count-up numbers, and skeleton loaders with `prefers-reduced-motion` support.

---

## 🔒 Advanced Regex Validation Engine

Centralized in `js/services/ValidationService.js`:
| Field | Validation Rule & Regex Pattern |
|---|---|
| **Full Name** | `/^[a-zA-Z\s'.\-]{3,50}$/` (Alphabetic characters, min 3, max 50) |
| **Email** | RFC-compliant standard email regex rejecting invalid syntax |
| **Password** | Min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special symbol |
| **Confirm Password** | Exact match with password |
| **Phone Number** | Pakistan mobile formats (`03XXXXXXXXX` or `+923XXXXXXXXX`) |
| **Hospital Name** | 3-100 characters alphanumeric and medical symbols |
| **Child Name** | Valid alphabetic characters (2-50 chars) |
| **Date of Birth** | Valid calendar date, strictly rejects future dates |
| **Appointment Date**| Strictly requires today or future dates |
| **Address** | Required, min 5 to max 200 characters |
| **Vaccine Name** | Required, min 2 characters |

---

## 📁 Scalable Directory Architecture

```
vaxora/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── images/
│   │   ├── logo/
│   │   ├── illustrations/
│   │   └── backgrounds/
│   ├── svg/
│   │   ├── icons/
│   │   │   └── vaxora-logo.svg
│   │   ├── decorations/
│   │   │   └── glass-mesh.svg
│   │   └── illustrations/
│   │       └── medical-hero.svg
│   └── fonts/
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── typography.css
│   │   └── animations.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   ├── modals.css
│   │   ├── tables.css
│   │   ├── sidebar.css
│   │   ├── navbar.css
│   │   ├── notifications.css
│   │   └── glass-ui.css
│   ├── layouts/
│   │   ├── landing.css
│   │   ├── dashboard.css
│   │   └── auth.css
│   ├── themes/
│   │   ├── light.css
│   │   └── dark.css
│   ├── pages/
│   │   ├── admin.css
│   │   ├── parent.css
│   │   └── hospital.css
│   ├── responsive/
│   │   └── responsive.css
│   └── main.css
└── js/
    ├── core/
    │   ├── app.js
    │   ├── router.js
    │   ├── state.js
    │   ├── eventBus.js
    │   └── constants.js
    ├── services/
    │   ├── AuthService.js
    │   ├── AdminService.js
    │   ├── ParentService.js
    │   ├── HospitalService.js
    │   ├── ChildService.js
    │   ├── VaccineService.js
    │   ├── BookingService.js
    │   ├── VaccinationService.js
    │   ├── NotificationService.js
    │   ├── ValidationService.js
    │   ├── StorageService.js
    │   ├── ThemeService.js
    │   └── ReportService.js
    ├── components/
    │   ├── Sidebar.js
    │   ├── Navbar.js
    │   ├── Modal.js
    │   ├── StatCard.js
    │   ├── DataTable.js
    │   └── ...
    ├── features/
    │   ├── landing.js
    │   ├── auth/ (login, register, forgot-password)
    │   ├── admin/ (dashboard, children, schedule, reports, vaccines, requests, hospitals, bookings)
    │   ├── parent/ (dashboard, children, schedule, book, requests, history, profile)
    │   └── hospital/ (dashboard, appointments, vaccination-status)
    ├── utils/
    │   ├── helpers.js
    │   ├── dateUtils.js
    │   ├── formatters.js
    │   └── domUtils.js
    └── data/
        ├── mockUsers.js
        ├── mockChildren.js
        ├── mockVaccines.js
        ├── mockHospitals.js
        └── mockBookings.js
```

---

## 🔑 Pre-Configured Demo Accounts

For instant evaluation, you can use the **1-Click Demo Logins** on the login screen or enter:

| Portal | Email | Password | Role Description |
|---|---|---|---|
| **Admin Portal** | `admin@vaxora.health` | `Admin@1234` | Dr. Zunaira Malik (Chief Immunization Director) |
| **Parent Portal** | `fatima@gmail.com` | `Parent@1234` | Fatima Ahmed (Mother of Rayan & Zainab) |
| **Hospital Portal**| `shifa@hospital.com` | `Hospital@1234` | Shifa International Hospital (Islamabad) |

*A "Reset Demo Data" button is located in the top navigation bar to quickly restore the mock database.*

---

## 💻 How to Run

1. Clone or open this folder in **VS Code**.
2. Right click on `index.html` and select **"Open with Live Server"** (or use any static web server / XAMPP).
3. The application will immediately run in your browser at `http://127.0.0.1:5500/` or `http://localhost/vaccine_management_system/`.
