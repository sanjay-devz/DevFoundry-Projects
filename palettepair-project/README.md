# PalettePair

PalettePair is a lightweight color palette generator built with plain HTML, CSS, and JavaScript. Explore five-color palettes, keep the shades you like, check text contrast, and save combinations in your browser.

## Features

- Generate five valid HEX colors, with individual swatch locking
- Copy HEX values using the Clipboard API with a legacy fallback
- Save, restore, and delete palettes using browser LocalStorage
- Space-bar generation shortcut that stays out of the way of controls
- Contrast preview with WCAG AA checks for normal and large text
- Responsive layout, keyboard focus styles, and reduced-motion support

## Files

```text
palettepair/
├── index.html   Semantic page structure
├── style.css    Responsive visual design and component styles
├── script.js    Palette behavior, storage, clipboard, and contrast math
└── README.md    Project notes and instructions
```

## Setup

No install or build step is needed. Open `index.html` in a modern browser. Clipboard access is most reliable on `localhost` or an HTTPS page; the app also tries a browser copy fallback.

## How to use

1. Choose **Generate palette** or press **Space** to get new colors.
2. Use the lock control on any swatch to keep that color during the next generation.
3. Click a HEX label or copy control to copy its value.
4. Choose **Save palette** to add the current combination to your library. Restore or delete it there later.
5. Select foreground and background colors in the contrast preview to see the ratio and AA results.

Saved palettes remain in the same browser profile and origin. Clearing browser site data removes them. Contrast results check text-to-background color contrast only; they do not guarantee that a full interface is accessible.

## Concepts learned

Semantic HTML, CSS custom properties, responsive CSS Grid, DOM creation and updates, event listeners, array mapping, random numbers, browser clipboard access, defensive JSON parsing, LocalStorage, and WCAG relative-luminance contrast calculations.
