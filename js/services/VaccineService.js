/**
 * VaccineService
 * Manages vaccine catalog, CRUD, age milestones, and availability statuses
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS, VACCINE_STATUS } from "../core/constants.js";
import { generateId } from "../utils/helpers.js";
import { eventBus } from "../core/eventBus.js";

class VaccineService {
  getAllVaccines() {
    return storageService.get(STORAGE_KEYS.VACCINES, []);
  }

  getAvailableVaccines() {
    return this.getAllVaccines().filter(v => v.status === VACCINE_STATUS.AVAILABLE);
  }

  getVaccineById(id) {
    const list = this.getAllVaccines();
    return list.find(v => v.id === id) || null;
  }

  addVaccine(data) {
    const list = this.getAllVaccines();
    const newVaccine = {
      id: generateId("vac"),
      name: data.name.trim(),
      code: data.code ? data.code.trim().toUpperCase() : data.name.substring(0, 4).toUpperCase(),
      targetDisease: data.targetDisease ? data.targetDisease.trim() : "Standard Immunization",
      recommendedAge: data.recommendedAge || "Birth",
      dosesRequired: parseInt(data.dosesRequired, 10) || 1,
      description: data.description ? data.description.trim() : "",
      sideEffects: data.sideEffects ? data.sideEffects.trim() : "No serious adverse reactions reported.",
      status: data.status || VACCINE_STATUS.AVAILABLE,
      temperatureStorage: data.temperatureStorage || "2°C to 8°C"
    };

    list.push(newVaccine);
    storageService.set(STORAGE_KEYS.VACCINES, list);
    eventBus.emit("vaccines:updated");
    return newVaccine;
  }

  updateVaccine(id, updateData) {
    const list = this.getAllVaccines();
    const index = list.findIndex(v => v.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      name: updateData.name ? updateData.name.trim() : list[index].name,
      code: updateData.code ? updateData.code.trim().toUpperCase() : list[index].code,
      targetDisease: updateData.targetDisease ? updateData.targetDisease.trim() : list[index].targetDisease,
      recommendedAge: updateData.recommendedAge || list[index].recommendedAge,
      dosesRequired: updateData.dosesRequired ? parseInt(updateData.dosesRequired, 10) : list[index].dosesRequired,
      description: updateData.description !== undefined ? updateData.description.trim() : list[index].description,
      status: updateData.status || list[index].status
    };

    storageService.set(STORAGE_KEYS.VACCINES, list);
    eventBus.emit("vaccines:updated");
    return list[index];
  }

  toggleAvailability(id) {
    const list = this.getAllVaccines();
    const index = list.findIndex(v => v.id === id);
    if (index === -1) return null;

    list[index].status =
      list[index].status === VACCINE_STATUS.AVAILABLE
        ? VACCINE_STATUS.UNAVAILABLE
        : VACCINE_STATUS.AVAILABLE;

    storageService.set(STORAGE_KEYS.VACCINES, list);
    eventBus.emit("vaccines:updated");
    return list[index];
  }

  deleteVaccine(id) {
    let list = this.getAllVaccines();
    list = list.filter(v => v.id !== id);
    storageService.set(STORAGE_KEYS.VACCINES, list);
    eventBus.emit("vaccines:updated");
    return true;
  }
}

export const vaccineService = new VaccineService();
