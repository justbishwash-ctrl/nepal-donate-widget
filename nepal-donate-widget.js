/*!
 * Nepal PM Disaster Relief Fund Donation Widget
 * Version: 1.0.0
 * Author: Bishwash Neupane
 * License: MIT
 * CDN: https://cdn.jsdelivr.net/gh/{your-github-username}/nepal-donate-widget@1/nepal-donate-widget.min.js
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.NepalDonateWidget = factory());
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // ─── Constants ───────────────────────────────────────────────────────────────
  const DONATE_URL   = 'https://donate.gov.np/';
  const WIDGET_ID    = '__ndw_root__';
  const STORAGE_KEY  = '__ndw_dismissed__';
  const FONT_URL     = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const CSS = `
    @import url('${FONT_URL}');

    #${WIDGET_ID} *,
    #${WIDGET_ID} *::before,
    #${WIDGET_ID} *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Overlay */
    #${WIDGET_ID} .ndw-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 20, 40, 0.72);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: ndw-fade-in 0.25s ease forwards;
    }

    /* Modal card */
    #${WIDGET_ID} .ndw-card {
      background: #fff;
      border-radius: 16px;
      width: 100%;
      max-width: 420px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,0.28);
      animation: ndw-slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    /* Hero band — Nepal flag crimson + blue */
    #${WIDGET_ID} .ndw-hero {
      background: linear-gradient(135deg, #C8102E 0%, #9B0022 55%, #003893 100%);
      padding: 28px 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    #${WIDGET_ID} .ndw-hero::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 20px;
      background: #fff;
      border-radius: 20px 20px 0 0;
    }

    /* Nepal emblem / flag emoji wrapper */
    #${WIDGET_ID} .ndw-flag {
      font-size: 48px;
      line-height: 1;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
    }

    #${WIDGET_ID} .ndw-hero-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.75);
      text-transform: uppercase;
      text-align: center;
    }

    /* Body */
    #${WIDGET_ID} .ndw-body {
      padding: 20px 24px 24px;
    }

    #${WIDGET_ID} .ndw-heading {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
      text-align: center;
      margin-bottom: 10px;
    }

    #${WIDGET_ID} .ndw-heading span {
      color: #C8102E;
    }

    #${WIDGET_ID} .ndw-desc {
      font-size: 14px;
      color: #4B5563;
      line-height: 1.65;
      text-align: center;
      margin-bottom: 20px;
    }

    /* Donate button */
    #${WIDGET_ID} .ndw-btn-donate {
      display: block;
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #C8102E, #9B0022);
      color: #fff;
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.02em;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      box-shadow: 0 4px 16px rgba(200,16,46,0.35);
      position: relative;
      overflow: hidden;
    }

    #${WIDGET_ID} .ndw-btn-donate::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0);
      transition: background 0.15s ease;
    }

    #${WIDGET_ID} .ndw-btn-donate:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(200,16,46,0.45);
      filter: brightness(1.06);
    }

    #${WIDGET_ID} .ndw-btn-donate:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(200,16,46,0.3);
    }

    #${WIDGET_ID} .ndw-btn-donate .ndw-btn-icon {
      margin-right: 8px;
    }

    /* Dismiss link */
    #${WIDGET_ID} .ndw-dismiss-wrap {
      text-align: center;
      margin-top: 14px;
    }

    #${WIDGET_ID} .ndw-btn-dismiss {
      font-family: inherit;
      font-size: 12px;
      color: #9CA3AF;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: color 0.15s ease;
      padding: 4px;
    }

    #${WIDGET_ID} .ndw-btn-dismiss:hover {
      color: #6B7280;
    }

    /* Close X button */
    #${WIDGET_ID} .ndw-close {
      position: absolute;
      top: 10px;
      right: 12px;
      background: rgba(255,255,255,0.15);
      border: none;
      color: #fff;
      font-size: 18px;
      line-height: 1;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      transition: background 0.15s ease;
      font-family: inherit;
    }

    #${WIDGET_ID} .ndw-close:hover {
      background: rgba(255,255,255,0.28);
    }

    /* Footer trust line */
    #${WIDGET_ID} .ndw-trust {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-size: 11px;
      color: #9CA3AF;
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid #F3F4F6;
    }

    #${WIDGET_ID} .ndw-trust a {
      color: #6B7280;
      text-decoration: none;
      font-weight: 500;
    }

    #${WIDGET_ID} .ndw-trust a:hover {
      color: #C8102E;
      text-decoration: underline;
    }

    /* Animations */
    @keyframes ndw-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes ndw-slide-up {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }

    @keyframes ndw-fade-out {
      from { opacity: 1; }
      to   { opacity: 0; }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      #${WIDGET_ID} .ndw-overlay,
      #${WIDGET_ID} .ndw-card {
        animation: none;
      }
    }
  `;

  // ─── HTML template ────────────────────────────────────────────────────────────
  function buildHTML() {
    return `
      <div class="ndw-overlay" role="dialog" aria-modal="true" aria-labelledby="ndw-title" aria-describedby="ndw-desc">
        <div class="ndw-card">
          <div class="ndw-hero">
            <button class="ndw-close" id="ndw-close-btn" aria-label="Close donation popup">&#215;</button>
            <div class="ndw-flag" aria-hidden="true">🇳🇵</div>
            <p class="ndw-hero-title">Government of Nepal</p>
          </div>
          <div class="ndw-body">
            <h2 class="ndw-heading" id="ndw-title">
              <span>Prime Minister's</span><br>Disaster Relief Fund
            </h2>
            <p class="ndw-desc" id="ndw-desc">
              Nepal is responding to a national disaster. Your contribution — large or small — reaches affected communities through the official government relief fund.
            </p>
            <a
              href="${DONATE_URL}"
              target="_blank"
              rel="noopener noreferrer"
              class="ndw-btn-donate"
              id="ndw-donate-btn"
              aria-label="Donate to PM Disaster Relief Fund, opens donate.gov.np"
            >
              <span class="ndw-btn-icon" aria-hidden="true">❤️</span> Donate Now
            </a>
            <div class="ndw-dismiss-wrap">
              <button class="ndw-btn-dismiss" id="ndw-dismiss-btn">
                Dismiss and don't show again
              </button>
            </div>
            <div class="ndw-trust">
              <span aria-hidden="true">🔒</span>
              <span>Official fund at</span>
              <a href="${DONATE_URL}" target="_blank" rel="noopener noreferrer">donate.gov.np</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Core class ──────────────────────────────────────────────────────────────
  class NepalDonateWidget {
    /**
     * @param {object} options
     * @param {number}  [options.delay=1500]          ms before popup appears
     * @param {boolean} [options.respectDismiss=true]  honour "don't show again" flag
     * @param {boolean} [options.closeOnOverlay=true]  click overlay to close
     */
    constructor(options = {}) {
      this.opts = Object.assign({
        delay:           1500,
        respectDismiss:  true,
        closeOnOverlay:  true,
      }, options);

      this._root    = null;
      this._styleEl = null;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    init() {
      if (this.opts.respectDismiss && this._wasDismissed()) return this;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this._schedule());
      } else {
        this._schedule();
      }

      return this;
    }

    open() {
      if (document.getElementById(WIDGET_ID)) return;
      this._injectStyles();
      this._injectWidget();
      this._bindEvents();
      document.body.style.overflow = 'hidden';
    }

    close(dismiss = false) {
      const root = document.getElementById(WIDGET_ID);
      if (!root) return;

      if (dismiss) this._markDismissed();

      // Fade out before DOM removal
      const overlay = root.querySelector('.ndw-overlay');
      if (overlay) {
        overlay.style.animation = 'ndw-fade-out 0.2s ease forwards';
        overlay.addEventListener('animationend', () => {
          this._cleanup();
        }, { once: true });
      } else {
        this._cleanup();
      }
    }

    destroy() {
      this._cleanup();
    }

    // ── Private ───────────────────────────────────────────────────────────────

    _schedule() {
      setTimeout(() => this.open(), this.opts.delay);
    }

    _injectStyles() {
      if (document.getElementById('__ndw_styles__')) return;
      const el = document.createElement('style');
      el.id = '__ndw_styles__';
      el.textContent = CSS;
      document.head.appendChild(el);
      this._styleEl = el;
    }

    _injectWidget() {
      const root = document.createElement('div');
      root.id = WIDGET_ID;
      root.innerHTML = buildHTML();
      document.body.appendChild(root);
      this._root = root;
    }

    _bindEvents() {
      const root = document.getElementById(WIDGET_ID);
      if (!root) return;

      // Close X
      root.querySelector('#ndw-close-btn')
        .addEventListener('click', () => this.close(false));

      // Dismiss permanently
      root.querySelector('#ndw-dismiss-btn')
        .addEventListener('click', () => this.close(true));

      // Click overlay to close
      if (this.opts.closeOnOverlay) {
        root.querySelector('.ndw-overlay')
          .addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close(false);
          });
      }

      // Escape key
      this._escHandler = (e) => {
        if (e.key === 'Escape') this.close(false);
      };
      document.addEventListener('keydown', this._escHandler);

      // Trap focus inside modal
      this._trapFocus(root.querySelector('.ndw-card'));
    }

    _trapFocus(el) {
      const focusable = el.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      first.focus();

      this._focusTrap = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      el.addEventListener('keydown', this._focusTrap);
    }

    _cleanup() {
      const root = document.getElementById(WIDGET_ID);
      if (root) root.remove();

      if (this._escHandler) {
        document.removeEventListener('keydown', this._escHandler);
        this._escHandler = null;
      }

      document.body.style.overflow = '';
      this._root = null;
    }

    _markDismissed() {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
    }

    _wasDismissed() {
      try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (_) { return false; }
    }
  }

  // ─── Auto-init via data attribute ────────────────────────────────────────────
  // <script src="..." data-auto-init data-delay="2000"></script>
  function autoInit() {
    const script = document.currentScript
      || document.querySelector('script[data-auto-init][src*="nepal-donate-widget"]');

    if (script && script.hasAttribute('data-auto-init')) {
      const delay          = parseInt(script.getAttribute('data-delay'), 10) || 1500;
      const respectDismiss = script.getAttribute('data-respect-dismiss') !== 'false';
      const closeOnOverlay = script.getAttribute('data-close-on-overlay') !== 'false';

      new NepalDonateWidget({ delay, respectDismiss, closeOnOverlay }).init();
    }
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
    }
  }

  return NepalDonateWidget;
}));
