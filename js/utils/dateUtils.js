/**
 * Date and Age calculation utilities
 */

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return dateTimeString;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function calculateAge(dobString) {
  if (!dobString) return "Unknown";
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return "Invalid date";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years === 0) {
    if (months === 0) {
      const diffTime = Math.abs(today - birthDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
    }
    return `${months} Month${months === 1 ? "" : "s"}`;
  } else if (years < 2) {
    return `${years} Yr ${months} Mo`;
  } else {
    return `${years} Years`;
  }
}

export function isPastDate(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
}

export function isFutureDate(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target >= today;
}
