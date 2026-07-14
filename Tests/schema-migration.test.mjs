import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

const app = loadAppsScript(['ConfigurationMigrations.gs']);

class MatrixSheet {
  constructor(rows) {
    this.rows = rows.map((row) => row.slice());
  }

  getLastRow() {
    return this.rows.length;
  }

  getDataRange() {
    return { getValues: () => this.rows.map((row) => row.slice()) };
  }

  getRange(row, column, rowCount = 1, columnCount = 1) {
    return {
      getValues: () => this.rows.slice(row - 1, row - 1 + rowCount).map((item) => item.slice(column - 1, column - 1 + columnCount)),
      setValues: (values) => values.forEach((valueRow, rowOffset) => valueRow.forEach((value, columnOffset) => {
        while (this.rows.length <= row - 1 + rowOffset) this.rows.push([]);
        this.rows[row - 1 + rowOffset][column - 1 + columnOffset] = value;
      })),
      setValue: (value) => {
        this.rows[row - 1][column - 1] = value;
      }
    };
  }

  insertRowBefore(row) {
    this.rows.splice(row - 1, 0, []);
  }

  deleteColumn(column) {
    this.rows.forEach((row) => row.splice(column - 1, 1));
  }
}

test('AuditLog migration inserts headers without replacing the first event', () => {
  const sheet = new MatrixSheet([['2026-07-14', 'DOPOST_ERROR', 'details']]);

  assert.equal(app.ensureAuditLogHeaders(sheet), true);
  assert.deepEqual(sheet.rows[0], ['timestamp', 'action', 'details']);
  assert.deepEqual(sheet.rows[1], ['2026-07-14', 'DOPOST_ERROR', 'details']);
  assert.equal(app.ensureAuditLogHeaders(sheet), false);
});

test('blank-column detection protects the localized Messages schema', () => {
  const rows = [
    ['key', 'uk', 'ru', 'en', '', ''],
    ['A', 'a', 'a', 'a', '', 'unexpected']
  ];

  assert.deepEqual(Array.from(app.getBlankColumnIndexes(rows, 4)), [4]);
});

test('legacy session values move into JSON without overwriting newer values', () => {
  const headers = ['telegram_id', 'location_id', 'customer_name', 'session_data', 'updated_at'];
  const migrated = app.buildMigratedSessionData(headers, [123, 'loc_001', 'Legacy', '{"customer_name":"Current"}', 'date']);

  assert.equal(migrated.changed, true);
  assert.deepEqual(JSON.parse(migrated.jsonText), { customer_name: 'Current', location_id: 'loc_001' });
});

test('UserSessions migration keeps only core columns and is repeat-safe', () => {
  const sheet = new MatrixSheet([
    ['telegram_id', 'location_id', 'session_data', 'updated_at'],
    ['123', 'loc_001', '{}', '2026-07-14']
  ]);

  const first = app.migrateLegacyUserSessions(sheet);
  assert.equal(first.migratedRows, 1);
  assert.deepEqual(Array.from(first.deletedColumns), ['location_id']);
  assert.deepEqual(sheet.rows[0], ['telegram_id', 'session_data', 'updated_at']);
  assert.deepEqual(JSON.parse(sheet.rows[1][1]), { location_id: 'loc_001' });

  const second = app.migrateLegacyUserSessions(sheet);
  assert.equal(second.migratedRows, 0);
  assert.deepEqual(Array.from(second.deletedColumns), []);
});
