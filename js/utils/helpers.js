/**
 * General helper utilities
 */

export function generateId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function truncate(str, max = 50) {
  if (!str) return "";
  return str.length > max ? str.substring(0, max) + "..." : str;
}
