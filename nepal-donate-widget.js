/*!
 * Nepal PM Disaster Relief Fund Donation Widget
 * Version: 2.0.0
 * Author: Bishwash Neupane
 * License: MIT
 * CDN: https://cdn.jsdelivr.net/gh/justbishwash-ctrl/nepal-donate-widget@1/nepal-donate-widget.min.js
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.NepalDonateWidget = factory());
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const DONATE_URL  = 'https://donate.gov.np/';
  const WIDGET_ID   = '__ndw_root__';
  const STORAGE_KEY = '__ndw_dismissed__';

  /* ─── Nepal flag SVG (accurate proportions, inline) ─────────────────────── */
  const FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 156" role="img" aria-label="Nepal flag">
    <!-- Outer border shape -->
    <polygon points="4,4 84,4 84,72 4,152" fill="#003893" stroke="#003893" stroke-width="0"/>
    <!-- White border outline -->
    <polygon points="0,0 90,0 90,76 0,156" fill="none" stroke="#ffffff" stroke-width="3"/>
    <!-- Inner crimson body -->
    <polygon points="4,4 84,4 84,72 4,152" fill="#be0027"/>
    <!-- White border line between two triangles -->
    <polygon points="4,76 84,4 84,76" fill="#003893"/>
    <polygon points="4,76 4,152 84,72 84,76" fill="#003893"/>
    <!-- Moon (top triangle) -->
    <g transform="translate(44, 28)">
      <path d="M0,-14 C6,-14 11,-9 11,-2 C11,6 6,12 0,12 C-2,12 -4,11 -6,10 C-2,8 1,4 1,-2 C1,-8 -2,-12 -6,-13 C-4,-14 -2,-14 0,-14 Z" fill="white"/>
      <!-- Moon rays -->
      <line x1="0" y1="-16" x2="0" y2="-12" stroke="white" stroke-width="1.2"/>
      <line x1="11" y1="-11" x2="8" y2="-8" stroke="white" stroke-width="1.2"/>
      <line x1="14" y1="0" x2="10" y2="0" stroke="white" stroke-width="1.2"/>
      <line x1="11" y1="11" x2="8" y2="8" stroke="white" stroke-width="1.2"/>
      <line x1="0" y1="14" x2="0" y2="10" stroke="white" stroke-width="1.2"/>
      <line x1="-11" y1="11" x2="-8" y2="8" stroke="white" stroke-width="1.2"/>
      <line x1="-14" y1="0" x2="-10" y2="0" stroke="white" stroke-width="1.2"/>
      <line x1="-11" y1="-11" x2="-8" y2="-8" stroke="white" stroke-width="1.2"/>
    </g>
    <!-- Sun (bottom triangle) -->
    <g transform="translate(44, 106)">
      <circle cx="0" cy="0" r="10" fill="white"/>
      <circle cx="0" cy="0" r="4" fill="#be0027"/>
      <line x1="0" y1="-14" x2="0" y2="-11" stroke="white" stroke-width="1.5"/>
      <line x1="0" y1="11" x2="0" y2="14" stroke="white" stroke-width="1.5"/>
      <line x1="-14" y1="0" x2="-11" y2="0" stroke="white" stroke-width="1.5"/>
      <line x1="11" y1="0" x2="14" y2="0" stroke="white" stroke-width="1.5"/>
      <line x1="-10" y1="-10" x2="-8" y2="-8" stroke="white" stroke-width="1.5"/>
      <line x1="8" y1="-8" x2="10" y2="-10" stroke="white" stroke-width="1.5"/>
      <line x1="-10" y1="10" x2="-8" y2="8" stroke="white" stroke-width="1.5"/>
      <line x1="8" y1="8" x2="10" y2="10" stroke="white" stroke-width="1.5"/>
    </g>
  </svg>`;

  /* ─── Styles ─────────────────────────────────────────────────────────────── */
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

    #${WIDGET_ID} *, #${WIDGET_ID} *::before, #${WIDGET_ID} *::after {
      box-sizing: border-box; margin: 0; padding: 0;
    }

    #${WIDGET_ID} .ndw-overlay {
      position: fixed;
      inset: 0;
      background: rgba(18, 18, 24, 0.55);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: ndw-in 0.22s ease forwards;
    }

    #${WIDGET_ID} .ndw-card {
      background: #F8F7F4;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.14);
      animation: ndw-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      font-family: 'DM Sans', system-ui, sans-serif;
      position: relative;
    }

    /* Left accent stripe — crimson, holds the flag */
    #${WIDGET_ID} .ndw-stripe {
      width: 72px;
      min-width: 72px;
      background: #be0027;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
    }

    #${WIDGET_ID} .ndw-stripe svg {
      width: 38px;
      height: auto;
      display: block;
      filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));
    }

    /* Main content */
    #${WIDGET_ID} .ndw-content {
      flex: 1;
      padding: 22px 20px 18px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    #${WIDGET_ID} .ndw-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 26px;
      height: 26px;
      border: none;
      background: transparent;
      color: #9a9a9a;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.12s, color 0.12s;
      font-family: inherit;
    }

    #${WIDGET_ID} .ndw-close:hover {
      background: #ECEAE5;
      color: #333;
    }

    #${WIDGET_ID} .ndw-eyebrow {
      font-size: 10px;
      font-weight: 500;
      color: #be0027;
      letter-spacing: 0.04em;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    #${WIDGET_ID} .ndw-eyebrow::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 1.5px;
      background: #be0027;
      border-radius: 2px;
    }

    #${WIDGET_ID} .ndw-heading {
      font-size: 16px;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.3;
      margin-bottom: 8px;
      padding-right: 20px;
    }

    #${WIDGET_ID} .ndw-desc {
      font-size: 12.5px;
      color: #6b6b6b;
      line-height: 1.6;
      margin-bottom: 16px;
      border-top: 1px solid #E8E4DC;
      padding-top: 10px;
    }

    #${WIDGET_ID} .ndw-btn-donate {
      display: block;
      width: 100%;
      padding: 10px 16px;
      background: #1a1a2e;
      color: #F8F7F4;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      letter-spacing: 0.01em;
      transition: background 0.15s;
      margin-bottom: 10px;
    }

    #${WIDGET_ID} .ndw-btn-donate:hover {
      background: #be0027;
    }

    #${WIDGET_ID} .ndw-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    #${WIDGET_ID} .ndw-trust {
      font-size: 10.5px;
      color: #aaa;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    #${WIDGET_ID} .ndw-trust svg {
      width: 10px;
      height: 10px;
      opacity: 0.6;
    }

    #${WIDGET_ID} .ndw-btn-dismiss {
      font-family: inherit;
      font-size: 10.5px;
      color: #bbb;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px 0;
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: color 0.12s;
    }

    #${WIDGET_ID} .ndw-btn-dismiss:hover { color: #888; }

    @keyframes ndw-in  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ndw-up  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ndw-out { from { opacity: 1; } to { opacity: 0; } }

    @media (prefers-reduced-motion: reduce) {
      #${WIDGET_ID} .ndw-overlay,
      #${WIDGET_ID} .ndw-card { animation: none; }
    }

    @media (max-width: 440px) {
      #${WIDGET_ID} .ndw-stripe { width: 56px; min-width: 56px; }
      #${WIDGET_ID} .ndw-stripe svg { width: 30px; }
    }
  `;

  /* ─── HTML ───────────────────────────────────────────────────────────────── */
  function buildHTML() {
    return `
      <div class="ndw-overlay" role="dialog" aria-modal="true" aria-labelledby="ndw-heading" aria-describedby="ndw-desc">
        <div class="ndw-card">
          <div class="ndw-stripe" aria-hidden="true">${FLAG_SVG}</div>
          <div class="ndw-content">
            <button class="ndw-close" id="ndw-close-btn" aria-label="Close">&#215;</button>
            <p class="ndw-eyebrow">Government of Nepal</p>
            <h2 class="ndw-heading" id="ndw-heading">PM Disaster Relief Fund</h2>
            <p class="ndw-desc" id="ndw-desc">Nepal is responding to a national disaster. Your contribution reaches affected communities through the official fund.</p>
            <a href="${DONATE_URL}" target="_blank" rel="noopener noreferrer" class="ndw-btn-donate" id="ndw-donate-btn">
              Donate at donate.gov.np
            </a>
            <div class="ndw-footer">
              <span class="ndw-trust">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Official government fund
              </span>
              <button class="ndw-btn-dismiss" id="ndw-dismiss-btn">Don't show again</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ─── Widget class ───────────────────────────────────────────────────────── */
  class NepalDonateWidget {
    constructor(options = {}) {
      this.opts = Object.assign({ delay: 1500, respectDismiss: true, closeOnOverlay: true }, options);
    }

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
      const overlay = root.querySelector('.ndw-overlay');
      if (overlay) {
        overlay.style.animation = 'ndw-out 0.18s ease forwards';
        overlay.addEventListener('animationend', () => this._cleanup(), { once: true });
      } else {
        this._cleanup();
      }
    }

    destroy() { this._cleanup(); }

    _schedule() { setTimeout(() => this.open(), this.opts.delay); }

    _injectStyles() {
      if (document.getElementById('__ndw_styles__')) return;
      const el = document.createElement('style');
      el.id = '__ndw_styles__';
      el.textContent = CSS;
      document.head.appendChild(el);
    }

    _injectWidget() {
      const root = document.createElement('div');
      root.id = WIDGET_ID;
      root.innerHTML = buildHTML();
      document.body.appendChild(root);
    }

    _bindEvents() {
      const root = document.getElementById(WIDGET_ID);
      if (!root) return;
      root.querySelector('#ndw-close-btn').addEventListener('click', () => this.close(false));
      root.querySelector('#ndw-dismiss-btn').addEventListener('click', () => this.close(true));
      if (this.opts.closeOnOverlay) {
        root.querySelector('.ndw-overlay').addEventListener('click', e => {
          if (e.target === e.currentTarget) this.close(false);
        });
      }
      this._escHandler = e => { if (e.key === 'Escape') this.close(false); };
      document.addEventListener('keydown', this._escHandler);
      this._trapFocus(root.querySelector('.ndw-card'));
    }

    _trapFocus(el) {
      const focusable = el.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      first.focus();
      this._focusTrap = e => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
      };
      el.addEventListener('keydown', this._focusTrap);
    }

    _cleanup() {
      const root = document.getElementById(WIDGET_ID);
      if (root) root.remove();
      if (this._escHandler) { document.removeEventListener('keydown', this._escHandler); this._escHandler = null; }
      document.body.style.overflow = '';
    }

    _markDismissed() { try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {} }
    _wasDismissed()  { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (_) { return false; } }
  }

  /* ─── Auto-init ──────────────────────────────────────────────────────────── */
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
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
    else autoInit();
  }

  return NepalDonateWidget;
}));
