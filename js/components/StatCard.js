/**
 * StatCard Component
 * Glassmorphic stat cards with animated counters and color accents
 */

export function renderStatCard({ title, value, icon, subtext = "", colorScheme = "primary" }) {
  let iconClass = "stat-icon-wrapper";
  if (colorScheme === "lavender") iconClass += " stat-icon-lavender";
  if (colorScheme === "emerald") iconClass += " stat-icon-emerald";
  if (colorScheme === "amber") iconClass += " stat-icon-amber";

  return `
    <div class="stat-card">
      <div class="stat-info">
        <span class="stat-label">${title}</span>
        <span class="stat-value" data-counter="${value}">0</span>
        ${subtext ? `<span class="stat-subtext">${subtext}</span>` : ""}
      </div>
      <div class="${iconClass}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${icon}
        </svg>
      </div>
    </div>
  `;
}

/**
 * Animate numbers upward on mount
 */
export function animateCounters(context = document) {
  const elements = context.querySelectorAll("[data-counter]");
  elements.forEach(el => {
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    const duration = 800; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepIncrement = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepIncrement;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  });
}
