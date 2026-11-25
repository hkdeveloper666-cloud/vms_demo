/**
 * ChildService
 * Manages child registrations, profiles, filters, and immunization progress metrics
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS } from "../core/constants.js";
import { generateId } from "../utils/helpers.js";
import { eventBus } from "../core/eventBus.js";

class ChildService {
  getAllChildren() {
    return storageService.get(STORAGE_KEYS.CHILDREN, []);
  }

  getChildById(id) {
    const children = this.getAllChildren();
    return children.find(c => c.id === id) || null;
  }

  getChildrenByParent(parentId) {
    const children = this.getAllChildren();
    return children.filter(c => c.parentId === parentId);
  }

  addChild(childData, parentUser) {
    const children = this.getAllChildren();
    const newChild = {
      id: generateId("child"),
      name: childData.name.trim(),
      dob: childData.dob,
      gender: childData.gender || "Male",
      bloodGroup: childData.bloodGroup || "O+",
      parentId: parentUser.id,
      parentName: parentUser.name,
      parentPhone: parentUser.phone,
      parentRelation: childData.parentRelation || parentUser.relation || "Parent",
      emergencyContact: childData.emergencyContact || parentUser.emergencyContact || parentUser.phone,
      allergies: childData.allergies ? childData.allergies.trim() : "None reported",
      notes: childData.notes ? childData.notes.trim() : "",
      completedDoses: 0,
      totalRequiredDoses: 10,
      status: "Partially Vaccinated",
      createdAt: new Date().toISOString()
    };

    children.push(newChild);
    storageService.set(STORAGE_KEYS.CHILDREN, children);

    // Update parent's children array in users
    const users = storageService.get(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id === parentUser.id);
    if (userIndex !== -1) {
      if (!users[userIndex].children) users[userIndex].children = [];
      users[userIndex].children.push(newChild.id);
      storageService.set(STORAGE_KEYS.USERS, users);
    }

    eventBus.emit("children:updated");
    return newChild;
  }

  updateChild(id, updateData) {
    const children = this.getAllChildren();
    const index = children.findIndex(c => c.id === id);
    if (index === -1) return null;

    children[index] = {
      ...children[index],
      name: updateData.name ? updateData.name.trim() : children[index].name,
      dob: updateData.dob || children[index].dob,
      gender: updateData.gender || children[index].gender,
      bloodGroup: updateData.bloodGroup || children[index].bloodGroup,
      parentRelation: updateData.parentRelation || children[index].parentRelation,
      emergencyContact: updateData.emergencyContact || children[index].emergencyContact,
      allergies: updateData.allergies !== undefined ? updateData.allergies : children[index].allergies,
      notes: updateData.notes !== undefined ? updateData.notes : children[index].notes
    };

    storageService.set(STORAGE_KEYS.CHILDREN, children);
    eventBus.emit("children:updated");
    return children[index];
  }

  deleteChild(id) {
    let children = this.getAllChildren();
    children = children.filter(c => c.id !== id);
    storageService.set(STORAGE_KEYS.CHILDREN, children);
    eventBus.emit("children:updated");
    return true;
  }

  filterChildren({ search = "", gender = "", status = "" } = {}) {
    let list = this.getAllChildren();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.parentName.toLowerCase().includes(q) ||
          c.parentPhone.includes(q)
      );
    }

    if (gender && gender !== "all") {
      list = list.filter(c => c.gender.toLowerCase() === gender.toLowerCase());
    }

    if (status && status !== "all") {
      list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    return list;
  }
}

export const childService = new ChildService();
