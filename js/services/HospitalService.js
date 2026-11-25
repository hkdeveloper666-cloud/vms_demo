/**
 * HospitalService & HospitalManagementService
 * Manages healthcare providers, CRUD operations, locations, and search
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS } from "../core/constants.js";
import { generateId } from "../utils/helpers.js";
import { eventBus } from "../core/eventBus.js";

class HospitalService {
  getAllHospitals() {
    return storageService.get(STORAGE_KEYS.HOSPITALS, []);
  }

  getHospitalById(id) {
    const list = this.getAllHospitals();
    return list.find(h => h.id === id) || null;
  }

  addHospital(data) {
    const list = this.getAllHospitals();
    const newHospital = {
      id: generateId("hosp"),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      location: data.location ? data.location.trim() : `${data.city} Capital Territory`,
      description: data.description ? data.description.trim() : "Pediatric immunization and child wellness facility.",
      totalDosesAdministered: 0,
      activePediatricians: 6,
      status: "Active"
    };

    list.push(newHospital);
    storageService.set(STORAGE_KEYS.HOSPITALS, list);
    eventBus.emit("hospitals:updated");
    return newHospital;
  }

  updateHospital(id, updateData) {
    const list = this.getAllHospitals();
    const index = list.findIndex(h => h.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      name: updateData.name ? updateData.name.trim() : list[index].name,
      email: updateData.email ? updateData.email.toLowerCase().trim() : list[index].email,
      phone: updateData.phone ? updateData.phone.trim() : list[index].phone,
      address: updateData.address ? updateData.address.trim() : list[index].address,
      city: updateData.city ? updateData.city.trim() : list[index].city,
      location: updateData.location ? updateData.location.trim() : list[index].location,
      description: updateData.description !== undefined ? updateData.description.trim() : list[index].description
    };

    storageService.set(STORAGE_KEYS.HOSPITALS, list);
    eventBus.emit("hospitals:updated");
    return list[index];
  }

  deleteHospital(id) {
    let list = this.getAllHospitals();
    list = list.filter(h => h.id !== id);
    storageService.set(STORAGE_KEYS.HOSPITALS, list);
    eventBus.emit("hospitals:updated");
    return true;
  }

  searchHospitals({ search = "", city = "" } = {}) {
    let list = this.getAllHospitals();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        h =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q)
      );
    }

    if (city && city !== "all") {
      list = list.filter(h => h.city.toLowerCase() === city.toLowerCase());
    }

    return list;
  }

  getHospitalDashboardStats(hospitalId) {
    const bookings = storageService.get(STORAGE_KEYS.BOOKINGS, []).filter(b => b.hospitalId === hospitalId);

    const totalAppointments = bookings.length;
    const pendingAppointments = bookings.filter(b => b.status === "Pending").length;
    const upcomingAppointments = bookings.filter(b => b.status === "Approved").length;
    const completedVaccinations = bookings.filter(b => b.status === "Vaccinated").length;

    return {
      totalAppointments,
      pendingAppointments,
      upcomingAppointments,
      completedVaccinations,
      recentAppointments: bookings.slice(0, 6)
    };
  }
}

export const hospitalService = new HospitalService();
