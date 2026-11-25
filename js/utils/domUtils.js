/**
 * DOM Manipulation and Query Utilities
 */

export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

export function setHtml(selector, html, context = document) {
  const el = typeof selector === "string" ? $(selector, context) : selector;
  if (el) {
    el.innerHTML = html;
  }
}

export function addClass(el, className) {
  if (el) el.classList.add(className);
}

export function removeClass(el, className) {
  if (el) el.classList.remove(className);
}

export function toggleClass(el, className, force) {
  if (el) el.classList.toggle(className, force);
}

export function show(el) {
  if (el) el.style.display = "";
}

export function hide(el) {
  if (el) el.style.display = "none";
}
