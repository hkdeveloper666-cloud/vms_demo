/**
 * ThemeService
 * Manages Light/Dark theme switching, persistence, and system preference detection
 */
import { storageService } from "./StorageService.js";
import { STORAGE_KEYS } from "../core/constants.js";
import { appState } from "../core/state.js";

class ThemeService {
  constructor() {
    this.currentTheme = this.getSavedTheme();
    this.applyTheme(this.currentTheme);
  }

  getSavedTheme() {
    const saved = storageService.get(STORAGE_KEYS.THEME);
    if (saved) return saved;
    // Check OS preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    storageService.set(STORAGE_KEYS.THEME, theme);
    appState.setTheme(theme);
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(nextTheme);
    return nextTheme;
  }

  isDark() {
    return this.currentTheme === "dark";
  }
}

export const themeService = new ThemeService();
