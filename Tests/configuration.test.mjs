import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

const app = loadAppsScript([
  'ScheduleDateTimeUtils.gs',
  'ConfigurationRegistry.gs',
  'AdminConfigurationHorizons.gs',
  'AdminConfigurationWorkHours.gs',
  'Menus.gs'
]);

test('configuration day parser accepts only non-negative integer text', () => {
  assert.equal(app.parseConfigurationDays(' 30 '), 30);
  assert.equal(app.parseConfigurationDays('001'), 1);
  assert.equal(app.parseConfigurationDays('1.5'), 0);
  assert.equal(app.parseConfigurationDays('-1'), 0);
  assert.equal(app.parseConfigurationDays('abc'), 0);
});

test('configuration allowlist enforces supported ranges and values', () => {
  assert.equal(app.isAllowedAdminConfigurationValue('Language', 'ru'), true);
  assert.equal(app.isAllowedAdminConfigurationValue('Language', 'de'), false);
  assert.equal(app.isAllowedAdminConfigurationValue('BookingDaysAhead', 1), true);
  assert.equal(app.isAllowedAdminConfigurationValue('BookingDaysAhead', 365), true);
  assert.equal(app.isAllowedAdminConfigurationValue('BookingDaysAhead', 366), false);
  assert.equal(app.isAllowedAdminConfigurationValue('PaginationPageSize', 10), true);
  assert.equal(app.isAllowedAdminConfigurationValue('PaginationPageSize', 0), false);
  assert.equal(app.isAllowedAdminConfigurationValue('AdminTelegramIds', '726107007,726107008'), true);
  assert.equal(app.isAllowedAdminConfigurationValue('AdminTelegramIds', '726107007, 726107008'), false);
  assert.equal(app.isAllowedAdminConfigurationValue('UnknownSetting', 'value'), false);
});

test('default work hours parser is strict and preserves normalized values', () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(app.parseConfigurationDefaultWorkHours('09:00 - 20:30'))),
    { startTime: '09:00', endTime: '20:30' }
  );
  assert.equal(app.parseConfigurationDefaultWorkHours('9:00-20:00'), null);
  assert.equal(app.parseConfigurationDefaultWorkHours('24:00-25:00'), null);
});

test('pagination size falls back safely', () => {
  assert.equal(app.getPaginationPageSize({ PaginationPageSize: 7 }), 7);
  assert.equal(app.getPaginationPageSize({ PaginationPageSize: 0 }), 5);
  assert.equal(app.getPaginationPageSize({ PaginationPageSize: 11 }), 5);
  assert.equal(app.getPaginationPageSize({ PaginationPageSize: 'invalid' }), 5);
});
