/**
 * VAXORA Main Application Bootstrap
 */
import { storageService } from "../services/StorageService.js";
import { themeService } from "../services/ThemeService.js";
import { authService } from "../services/AuthService.js";
import { notificationService } from "../services/NotificationService.js";
import { loader } from "../components/Loader.js";
import { router } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Database Storage
  storageService.init();

  // 2. Initialize Theme
  // (themeService constructor runs and applies theme)

  // 3. Initialize Authentication Session
  authService.initSession();

  // 4. Initialize Router
  router.init();

  // 5. Dismiss Initial Application Loader smoothly
  setTimeout(() => {
    loader.hideInitialLoader();
  }, 250);

  console.log("%c VAXORA %c Immunization Management System Initialized ", "background:#5B8DEF; color:#FFF; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;", "background:#17233D; color:#A78BFA; font-weight:bold; padding:4px 8px; border-radius:0 4px 4px 0;");
});
