function createCustomerConflict(data) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMER_CONFLICTS);

  const rows =
    sheet.getDataRange().getValues();

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const conflictPhoneKeyIndex =
    headers.indexOf('conflict_phone_key');

  const activeIndex =
    headers.indexOf('active');

  for (let i = 1; i < rows.length; i++) {
    const phoneKey =
      String(rows[i][phoneKeyIndex]);

    const conflictPhoneKey =
      String(rows[i][conflictPhoneKeyIndex]);

    const active =
      String(rows[i][activeIndex]) !== 'FALSE';

    if (!active) {
      continue;
    }

    if (
      (
        phoneKey === String(data.phone_key) &&
        conflictPhoneKey === String(data.conflict_phone_key)
      ) ||
      (
        phoneKey === String(data.conflict_phone_key) &&
        conflictPhoneKey === String(data.phone_key)
      )
    ) {
      return false;
    }
  }

  const newRow =
    new Array(headers.length).fill('');

  newRow[
    headers.indexOf('conflict_id')
  ] =
    generateId('conflict');

  newRow[
    headers.indexOf('phone')
  ] =
    data.phone;

  newRow[
    headers.indexOf('phone_key')
  ] =
    data.phone_key;

  newRow[
    headers.indexOf('customer_name')
  ] =
    data.customer_name;

  newRow[
    headers.indexOf('conflict_phone')
  ] =
    data.conflict_phone;

  newRow[
    headers.indexOf('conflict_phone_key')
  ] =
    data.conflict_phone_key;

  newRow[
    headers.indexOf('conflict_customer_name')
  ] =
    data.conflict_customer_name;

  newRow[
    headers.indexOf('active')
  ] =
    true;

  newRow[
    headers.indexOf('created_at')
  ] =
    new Date();

  newRow[
    headers.indexOf('updated_at')
  ] =
    new Date();

  newRow[
    headers.indexOf('notes')
  ] =
    '';

  sheet.appendRow(newRow);

  return true;
}

function getCustomerConflictsByPhone(
  phone
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMER_CONFLICTS);

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKey =
    getPhoneSearchKey(phone);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (item.active === false) {
      continue;
    }

    if (
      String(item.phone_key) ===
      String(phoneKey)
    ) {
      result.push({
        phone: item.conflict_phone,
        customer_name:
          item.conflict_customer_name
      });

      continue;
    }

    if (
      String(item.conflict_phone_key) ===
      String(phoneKey)
    ) {
      result.push({
        phone: item.phone,
        customer_name:
          item.customer_name
      });
    }
  }

  return result;
}

function getCustomerConflictPhoneKeys(phone) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMER_CONFLICTS);

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const conflictPhoneKeyIndex =
    headers.indexOf('conflict_phone_key');

  const activeIndex =
    headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active =
      String(rows[i][activeIndex]).toUpperCase() !== 'FALSE';

    if (!active) {
      continue;
    }

    const rowPhoneKey =
      String(rows[i][phoneKeyIndex] || '');

    const rowConflictPhoneKey =
      String(rows[i][conflictPhoneKeyIndex] || '');

    if (rowPhoneKey === String(phoneKey)) {
      result.push(rowConflictPhoneKey);
      continue;
    }

    if (rowConflictPhoneKey === String(phoneKey)) {
      result.push(rowPhoneKey);
    }
  }

  return result;
}

function getConflictAppointmentsForDate(
  customerPhone,
  dateValue
) {
  const phoneKeys =
    getCustomerConflictPhoneKeys(
      customerPhone
    );

  if (phoneKeys.length === 0) {
    return [];
  }

  const appointments =
    getCachedAppointmentsByDate(
      normalizeDateForStorage(dateValue)
    );

  return appointments.filter(function(item) {
    const itemPhoneKey =
      getPhoneSearchKey(
        item.phone
      );

    return phoneKeys.indexOf(
      String(itemPhoneKey)
    ) !== -1;
  });
}

function deactivateCustomerConflict(
  phoneKey,
  conflictPhoneKey
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMER_CONFLICTS);

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const conflictPhoneKeyIndex =
    headers.indexOf('conflict_phone_key');

  const activeIndex =
    headers.indexOf('active');

  const updatedAtIndex =
    headers.indexOf('updated_at');

  for (let i = 1; i < rows.length; i++) {
    const rowPhoneKey =
      String(rows[i][phoneKeyIndex] || '');

    const rowConflictPhoneKey =
      String(rows[i][conflictPhoneKeyIndex] || '');

    const active =
      String(rows[i][activeIndex]).toUpperCase() !== 'FALSE' &&
      rows[i][activeIndex] !== false;

    if (!active) {
      continue;
    }

    const matched =
      (
        rowPhoneKey === String(phoneKey) &&
        rowConflictPhoneKey === String(conflictPhoneKey)
      ) ||
      (
        rowPhoneKey === String(conflictPhoneKey) &&
        rowConflictPhoneKey === String(phoneKey)
      );

    if (!matched) {
      continue;
    }

    sheet
      .getRange(i + 1, activeIndex + 1)
      .setValue(false);

    sheet
      .getRange(i + 1, updatedAtIndex + 1)
      .setValue(new Date());

    return true;
  }

  return false;
}

function getConflictingCustomerIds(customerId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMER_CONFLICTS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex =
    headers.indexOf('customer_id');

  const conflictCustomerIdIndex =
    headers.indexOf('conflict_customer_id');

  const activeIndex =
    headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active =
      String(rows[i][activeIndex])
        .toUpperCase();

    if (active !== 'TRUE') {
      continue;
    }

    if (
      String(rows[i][customerIdIndex]) ===
      String(customerId)
    ) {
      result.push(
        rows[i][conflictCustomerIdIndex]
      );
    }
  }

  return result;
}
