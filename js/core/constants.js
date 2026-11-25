/**
 * VAXORA Core Constants & Enums
 */

export const ROLES = {
  ADMIN: "admin",
  PARENT: "parent",
  HOSPITAL: "hospital"
};

export const BOOKING_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  VACCINATED: "Vaccinated",
  NOT_VACCINATED: "Not Vaccinated"
};

export const VACCINE_STATUS = {
  AVAILABLE: "Available",
  UNAVAILABLE: "Unavailable"
};

export const STORAGE_KEYS = {
  USERS: "vaxora_users",
  CURRENT_USER: "vaxora_current_user",
  CHILDREN: "vaxora_children",
  VACCINES: "vaxora_vaccines",
  HOSPITALS: "vaxora_hospitals",
  BOOKINGS: "vaxora_bookings",
  NOTIFICATIONS: "vaxora_notifications",
  THEME: "vaxora_theme",
  INITIALIZED: "vaxora_initialized_v1",
  SIDEBAR_COLLAPSED: "vaxora_sidebar_collapsed"
};

export const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM"
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const GENDERS = ["Male", "Female", "Other"];

export const PAKISTAN_CITIES = [
  "Islamabad",
  "Karachi",
  "Lahore",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Sialkot",
  "Gujranwala",
  "Hyderabad"
];
