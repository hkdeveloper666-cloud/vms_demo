/**
 * AuthService
 * Handles simulated authentication, registrations, demo login, session state, and permissions
 */
import { storageService } from "./StorageService.js";
import { appState } from "../core/state.js";
import { STORAGE_KEYS, ROLES } from "../core/constants.js";
import { generateId } from "../utils/helpers.js";

class AuthService {
  constructor() {
    this.initSession();
  }

  initSession() {
    const user = storageService.get(STORAGE_KEYS.CURRENT_USER);
    if (user) {
      appState.setCurrentUser(user);
    }
  }

  getCurrentUser() {
    return appState.getCurrentUser();
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  login(email, password, expectedRole = null) {
    const users = storageService.get(STORAGE_KEYS.USERS, []);
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    if (expectedRole && user.role !== expectedRole) {
      return {
        success: false,
        message: `Account found, but this portal is reserved for ${expectedRole.toUpperCase()}s.`
      };
    }

    // Save session
    storageService.set(STORAGE_KEYS.CURRENT_USER, user);
    appState.setCurrentUser(user);
    return { success: true, user };
  }

  registerParent(parentData) {
    const users = storageService.get(STORAGE_KEYS.USERS, []);
    const emailExists = users.some(u => u.email.toLowerCase() === parentData.email.toLowerCase().trim());

    if (emailExists) {
      return { success: false, message: "An account with this email address already exists." };
    }

    const initials = parentData.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: generateId("user-parent"),
      name: parentData.name.trim(),
      email: parentData.email.toLowerCase().trim(),
      password: parentData.password,
      role: ROLES.PARENT,
      phone: parentData.phone.trim(),
      address: parentData.address.trim(),
      city: parentData.city || "Islamabad",
      relation: parentData.relation || "Mother",
      emergencyContact: parentData.emergencyContact || parentData.phone,
      children: [],
      avatar: initials || "PA"
    };

    users.push(newUser);
    storageService.set(STORAGE_KEYS.USERS, users);
    storageService.set(STORAGE_KEYS.CURRENT_USER, newUser);
    appState.setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  registerHospital(hospitalData) {
    const users = storageService.get(STORAGE_KEYS.USERS, []);
    const emailExists = users.some(u => u.email.toLowerCase() === hospitalData.email.toLowerCase().trim());

    if (emailExists) {
      return { success: false, message: "An account with this email already exists." };
    }

    const hospitals = storageService.get(STORAGE_KEYS.HOSPITALS, []);
    const hospId = generateId("hosp");

    const newHospital = {
      id: hospId,
      name: hospitalData.name.trim(),
      email: hospitalData.email.toLowerCase().trim(),
      phone: hospitalData.phone.trim(),
      address: hospitalData.address.trim(),
      city: hospitalData.city.trim(),
      location: hospitalData.location ? hospitalData.location.trim() : `${hospitalData.city} Center`,
      description: hospitalData.description ? hospitalData.description.trim() : "Licensed pediatric immunization hospital.",
      totalDosesAdministered: 0,
      activePediatricians: 5,
      status: "Active"
    };

    const initials = hospitalData.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: generateId("user-hosp"),
      name: hospitalData.name.trim(),
      email: hospitalData.email.toLowerCase().trim(),
      password: hospitalData.password,
      role: ROLES.HOSPITAL,
      phone: hospitalData.phone.trim(),
      hospitalId: hospId,
      address: hospitalData.address.trim(),
      city: hospitalData.city.trim(),
      location: newHospital.location,
      avatar: initials || "HP"
    };

    hospitals.push(newHospital);
    users.push(newUser);

    storageService.set(STORAGE_KEYS.HOSPITALS, hospitals);
    storageService.set(STORAGE_KEYS.USERS, users);
    storageService.set(STORAGE_KEYS.CURRENT_USER, newUser);
    appState.setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  logout() {
    storageService.remove(STORAGE_KEYS.CURRENT_USER);
    appState.setCurrentUser(null);
  }

  /**
   * Quick demo account switcher
   */
  switchDemoUser(role) {
    const users = storageService.get(STORAGE_KEYS.USERS, []);
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      storageService.set(STORAGE_KEYS.CURRENT_USER, demoUser);
      appState.setCurrentUser(demoUser);
      return demoUser;
    }
    return null;
  }
}

export const authService = new AuthService();
