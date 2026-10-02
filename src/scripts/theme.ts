/**
 * Theme bootstrap.
 *
 * Runs synchronously in <head>, before first paint, and sets a single
 * attribute on <html>. Doing it here rather than in a deferred module is the
 * whole point: a late script means the page paints once in the default theme
 * and then snaps — a visible flash. This is inline and blocking by design, and
 * it is roughly 300 bytes.
 *
 * Precedence: explicit user choice (localStorage) > OS preference >
 * dark (the site default). An invalid or missing stored value falls through
 * to the OS preference rather than throwing.
 */
(() => {
  const KEY = 'jj-theme';
  const root = document.documentElement;
  let theme: string;

  try {
    const stored = localStorage.getItem(KEY);
    theme = stored === 'dark' || stored === 'light' ? stored : '';
  } catch {
    // Private browsing or blocked storage — fall back to the OS preference.
    theme = '';
  }

  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  root.dataset.theme = theme;
  // Drives the <meta name="color-scheme"> the UA uses for form controls and
  // scrollbars, so those match the page instead of flashing the other way.
  root.style.colorScheme = theme;
})();