import test from 'node:test'
import assert from 'node:assert/strict'
import { colorSuggestions, hexToHsl, hslToHex } from './colorHarmony.js'

test('converts primary colors to HSL and back', () => {
  assert.deepEqual(hexToHsl('#FF0000'), [0, 100, 50])
  assert.equal(hslToHex(0, 100, 50), '#FF0000')
  assert.equal(hslToHex(360, 100, 50), '#FF0000')
})

test('offers named, hex-valid harmony suggestions', () => {
  const suggestions = colorSuggestions('#FF0000')
  assert.deepEqual(suggestions.map(({ name }) => name), ['Complementary', 'Analogous', 'Triadic', 'Soft neutral'])
  assert.equal(suggestions[0].hex, '#00FFFF')
  assert.ok(suggestions.every(({ hex }) => /^#[\dA-F]{6}$/.test(hex)))
})

test('returns no suggestions for invalid input', () => {
  assert.deepEqual(colorSuggestions('not a color'), [])
})
