import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

const app = loadAppsScript(['PhoneUtils.gs']);

test('phone normalization strips formatting and restores local leading zero', () => {
  assert.equal(app.normalizePhone('+38 (077) 666-55-44'), '380776665544');
  assert.equal(app.normalizePhone('77 666 55 44'), '0776665544');
  assert.equal(app.normalizePhone(''), '');
});

test('phone search key matches local and international representations', () => {
  assert.equal(app.getPhoneSearchKey('+380776665544'), '776665544');
  assert.equal(app.getPhoneSearchKey('0776665544'), '776665544');
});

test('phone validation rejects values that are too short', () => {
  assert.equal(app.isValidPhone('1234567'), true);
  assert.equal(app.isValidPhone('123456'), false);
});

test('phone extraction handles free text fallback', () => {
  assert.equal(app.extractPhoneFromText('Клиент 077 666 55 44'), '0776665544');
  assert.equal(app.extractPhoneFromText('no phone here'), '');
});
