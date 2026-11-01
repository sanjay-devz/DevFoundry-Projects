import test from 'node:test'
import assert from 'node:assert/strict'
import { originGuard } from '../middleware/originGuard.js'

process.env.CLIENT_URLS = 'http://localhost:5173'

test('accepts the configured browser origin', () => {
  const req = { get: () => 'http://localhost:5173' }
  let passed = false
  originGuard(req, { status: () => ({ json: () => assert.fail('should allow configured origin') }) }, () => { passed = true })
  assert.equal(passed, true)
})

test('rejects an untrusted browser origin', () => {
  const req = { get: () => 'https://malicious.example' }
  let status
  let payload
  originGuard(req, { status: (value) => { status = value; return { json: (body) => { payload = body } } } }, () => assert.fail('should reject untrusted origin'))
  assert.equal(status, 403)
  assert.equal(payload.success, false)
})

test('allows requests without an Origin header for non-browser clients', () => {
  let passed = false
  originGuard({ get: () => undefined }, {}, () => { passed = true })
  assert.equal(passed, true)
})
