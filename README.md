# Nepal PM Disaster Relief Fund — Donation Widget

A zero-dependency, accessible popup widget that prompts visitors to donate to Nepal's **Prime Minister's Disaster Relief Fund** at [donate.gov.np](https://donate.gov.np/).

---

## CDN via jsDelivr

Replace `{your-username}` with your GitHub username after pushing this repo.

### Minified (production)
```html
<script src="https://cdn.jsdelivr.net/gh/{your-username}/nepal-donate-widget@1/nepal-donate-widget.min.js" data-auto-init></script>
```

### Unminified (development)
```html
<script src="https://cdn.jsdelivr.net/gh/{your-username}/nepal-donate-widget@1/nepal-donate-widget.js" data-auto-init></script>
```

---

## Usage

### 1. Auto-init (simplest — just add `data-auto-init`)

```html
<script
  src="https://cdn.jsdelivr.net/gh/{your-username}/nepal-donate-widget@1/nepal-donate-widget.min.js"
  data-auto-init
  data-delay="2000"
></script>
```

**Data attributes:**

| Attribute              | Default | Description                                        |
|------------------------|---------|----------------------------------------------------|
| `data-auto-init`       | —       | Presence triggers auto-initialization              |
| `data-delay`           | `1500`  | Milliseconds before popup appears                  |
| `data-respect-dismiss` | `true`  | Skip popup if user previously dismissed it         |
| `data-close-on-overlay`| `true`  | Click outside card to close                        |

---

### 2. Manual init (full control)

```html
<script src="https://cdn.jsdelivr.net/gh/{your-username}/nepal-donate-widget@1/nepal-donate-widget.min.js"></script>
<script>
  const widget = new NepalDonateWidget({
    delay:           2000,   // ms before auto-open
    respectDismiss:  true,   // honour localStorage "don't show again"
    closeOnOverlay:  true,   // click backdrop to close
  });

  widget.init(); // schedule auto-open after `delay`

  // Or open/close programmatically:
  // widget.open();
  // widget.close();          // close, keep showing next visit
  // widget.close(true);      // close + mark dismissed permanently
</script>
```

---

### 3. Button-triggered

```html
<button onclick="window.__donateWidget && window.__donateWidget.open()">
  Donate to Nepal
</button>

<script src="...nepal-donate-widget.min.js"></script>
<script>
  window.__donateWidget = new NepalDonateWidget({ delay: 0 });
</script>
```

---

## API

```js
const w = new NepalDonateWidget(options);

w.init();         // Schedule popup (respects delay + dismiss flag)
w.open();         // Show popup immediately
w.close();        // Hide popup (still shows next visit)
w.close(true);    // Hide popup + set localStorage dismiss flag
w.destroy();      // Remove widget from DOM entirely
```

---

## GitHub → jsDelivr setup

1. Push this repository to GitHub as a **public** repo.
2. Create a **GitHub Release** or **tag** (e.g. `v1.0.0`).
3. jsDelivr automatically serves:
   ```
   https://cdn.jsdelivr.net/gh/{username}/{repo}@{tag}/{file}
   ```
   Version pin with `@1` (major) or `@1.0.0` (exact). Use `@latest` only in dev.

---

## Features

- Zero dependencies — vanilla JS, no jQuery, no frameworks
- UMD build — works as ES module, CommonJS, AMD, or global script tag
- Accessible — ARIA roles, keyboard focus trap, Escape key, reduced-motion safe
- Persistent dismiss — `localStorage` so users aren't spammed
- Mobile-first responsive design
- Nepal flag colour palette (#C8102E crimson + #003893 blue)
- ~11 KB minified, ~0 KB gzipped overhead on repeat visits (cached by CDN)

---

## License

MIT © Bishwash Neupane
