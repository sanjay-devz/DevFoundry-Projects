'use strict';

const PALETTE_SIZE = 5;
const STORAGE_KEY = 'palettepair.savedPalettes';
const INITIAL_COLORS = ['#D96C4D', '#E7B86B', '#78917C', '#7685A4', '#B7A0A5'];
const swatchesElement = document.querySelector('#swatches');
const generateButton = document.querySelector('#generate-button');
const saveButton = document.querySelector('#save-button');
const savedPalettesElement = document.querySelector('#saved-palettes');
const emptyState = document.querySelector('#empty-state');
const savedCount = document.querySelector('#saved-count');
const foregroundSelect = document.querySelector('#foreground-select');
const backgroundSelect = document.querySelector('#background-select');
const contrastPreview = document.querySelector('#contrast-preview');
const contrastRatio = document.querySelector('#contrast-ratio');
const contrastBadges = document.querySelector('#contrast-badges');
const toastElement = document.querySelector('#toast');
let colors = [...INITIAL_COLORS];
let lockedColors = Array(PALETTE_SIZE).fill(false);
let savedPalettes = readSavedPalettes();
let toastTimer;

function randomHexColor() {
  return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0').toUpperCase()}`;
}

function isValidHex(value) {
  return /^#[0-9A-F]{6}$/i.test(value);
}

function renderSwatches() {
  swatchesElement.replaceChildren();
  colors.forEach((color, index) => {
    const swatch = document.createElement('article');
    const locked = lockedColors[index];
    swatch.className = `swatch${isLightColor(color) ? ' is-light' : ''}${locked ? ' is-locked' : ''}`;
    swatch.style.setProperty('--swatch-color', color);
    const tools = document.createElement('div');
    tools.className = 'swatch-tools';
    const copyButton = document.createElement('button');
    copyButton.className = 'icon-button';
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', `Copy ${color}`);
    copyButton.title = `Copy ${color}`;
    copyButton.textContent = '▢';
    copyButton.addEventListener('click', () => copyColor(color));
    const lockButton = document.createElement('button');
    lockButton.className = 'icon-button';
    lockButton.type = 'button';
    lockButton.setAttribute('aria-label', `${locked ? 'Unlock' : 'Lock'} color ${index + 1}, ${color}`);
    lockButton.setAttribute('aria-pressed', String(locked));
    lockButton.title = locked ? 'Unlock color' : 'Lock color';
    lockButton.textContent = locked ? '●' : '⌑';
    lockButton.addEventListener('click', () => toggleLock(index));
    tools.append(copyButton, lockButton);
    const bottom = document.createElement('div');
    bottom.className = 'swatch-bottom';
    const hexButton = document.createElement('button');
    hexButton.className = 'hex-button';
    hexButton.type = 'button';
    hexButton.textContent = color;
    hexButton.setAttribute('aria-label', `Copy color ${index + 1}, ${color}`);
    hexButton.addEventListener('click', () => copyColor(color));
    const number = document.createElement('span');
    number.className = 'swatch-index';
    number.textContent = String(index + 1).padStart(2, '0');
    bottom.append(hexButton, number);
    swatch.append(tools, bottom);
    swatchesElement.append(swatch);
  });
  updateContrastOptions();
}

function generatePalette() {
  colors = colors.map((color, index) => lockedColors[index] ? color : randomHexColor());
  renderSwatches();
  showToast('A fresh palette, just for you.');
}

function toggleLock(index) {
  lockedColors[index] = !lockedColors[index];
  renderSwatches();
  showToast(`Color ${index + 1} ${lockedColors[index] ? 'locked' : 'unlocked'}.`);
}

async function copyColor(color) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(color);
    } else if (!legacyCopy(color)) {
      throw new Error('Clipboard unavailable');
    }
    showToast(`${color} copied to clipboard.`);
  } catch (error) {
    showToast('Could not copy automatically. Select the HEX code to copy it.');
  }
}

function legacyCopy(value) {
  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  input.remove();
  return copied;
}

function readSavedPalettes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(palette => palette && typeof palette.id === 'string' && Array.isArray(palette.colors) && palette.colors.length === PALETTE_SIZE && palette.colors.every(isValidHex));
  } catch (error) {
    return [];
  }
}

function persistPalettes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPalettes));
    return true;
  } catch (error) {
    showToast('Storage is unavailable. Your palette could not be saved.');
    return false;
  }
}

function savePalette() {
  savedPalettes.unshift({ id: createId(), colors: [...colors], createdAt: new Date().toISOString() });
  if (persistPalettes()) {
    renderSavedPalettes();
    showToast('Palette saved to your library.');
  } else {
    savedPalettes.shift();
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderSavedPalettes() {
  savedPalettesElement.replaceChildren();
  savedCount.textContent = String(savedPalettes.length);
  emptyState.hidden = savedPalettes.length > 0;
  savedPalettes.forEach(palette => {
    const card = document.createElement('article');
    card.className = 'saved-card';
    const strip = document.createElement('div');
    strip.className = 'saved-colors';
    palette.colors.forEach(color => {
      const block = document.createElement('span');
      block.className = 'saved-color';
      block.style.backgroundColor = color;
      block.setAttribute('aria-label', color);
      strip.append(block);
    });
    const bottom = document.createElement('div');
    bottom.className = 'saved-card-bottom';
    const date = document.createElement('span');
    date.className = 'saved-date';
    date.textContent = formatDate(palette.createdAt);
    const actions = document.createElement('div');
    actions.className = 'saved-card-actions';
    const restore = document.createElement('button');
    restore.className = 'text-action';
    restore.type = 'button';
    restore.textContent = 'Restore';
    restore.setAttribute('aria-label', `Restore palette saved ${date.textContent}`);
    restore.addEventListener('click', () => restorePalette(palette));
    const remove = document.createElement('button');
    remove.className = 'text-action';
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete palette saved ${date.textContent}`);
    remove.addEventListener('click', () => deletePalette(palette.id));
    actions.append(restore, remove);
    bottom.append(date, actions);
    card.append(strip, bottom);
    savedPalettesElement.append(card);
  });
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Saved palette' : `Saved ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)}`;
}

function restorePalette(palette) {
  colors = [...palette.colors];
  lockedColors = Array(PALETTE_SIZE).fill(false);
  renderSwatches();
  showToast('Palette restored.');
  document.querySelector('.studio').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deletePalette(id) {
  const previous = savedPalettes;
  savedPalettes = savedPalettes.filter(palette => palette.id !== id);
  if (persistPalettes()) {
    renderSavedPalettes();
    showToast('Palette deleted.');
  } else {
    savedPalettes = previous;
  }
}

function updateContrastOptions() {
  const previousForeground = foregroundSelect.value;
  const previousBackground = backgroundSelect.value;
  foregroundSelect.replaceChildren();
  backgroundSelect.replaceChildren();
  colors.forEach((color, index) => {
    for (const select of [foregroundSelect, backgroundSelect]) {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = `${String(index + 1).padStart(2, '0')}  ${color}`;
      select.append(option);
    }
  });
  foregroundSelect.value = colors.includes(previousForeground) ? previousForeground : colors[0];
  backgroundSelect.value = colors.includes(previousBackground) && previousBackground !== foregroundSelect.value ? previousBackground : colors[4];
  if (backgroundSelect.value === foregroundSelect.value) backgroundSelect.value = colors[1];
  updateContrastPreview();
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(channel => parseInt(channel, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function getContrastRatio(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function updateContrastPreview() {
  const foreground = foregroundSelect.value;
  const background = backgroundSelect.value;
  if (!isValidHex(foreground) || !isValidHex(background)) return;
  const ratio = getContrastRatio(foreground, background);
  contrastPreview.style.color = foreground;
  contrastPreview.style.backgroundColor = background;
  contrastRatio.textContent = `${ratio.toFixed(2)}:1`;
  contrastBadges.replaceChildren();
  contrastBadges.append(makeBadge('AA normal 4.5:1', ratio >= 4.5), makeBadge('AA large 3:1', ratio >= 3));
}

function makeBadge(label, passes) {
  const badge = document.createElement('span');
  badge.className = `result-badge${passes ? ' pass' : ''}`;
  badge.textContent = `${passes ? 'PASS' : 'CHECK'} · ${label}`;
  return badge;
}

function isLightColor(hex) {
  return relativeLuminance(hex) > 0.46;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toastElement.classList.remove('is-visible'), 2400);
}

generateButton.addEventListener('click', generatePalette);
saveButton.addEventListener('click', savePalette);
foregroundSelect.addEventListener('change', updateContrastPreview);
backgroundSelect.addEventListener('change', updateContrastPreview);
document.addEventListener('keydown', event => {
  const target = event.target;
  const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName));
  if (event.code === 'Space' && !typing && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    generatePalette();
  }
});

renderSwatches();
renderSavedPalettes();

// Exposed for simple browser-console verification and beginner experimentation.
window.palettePair = { getContrastRatio, relativeLuminance };
