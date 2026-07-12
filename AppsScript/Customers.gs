let CUSTOMERS_CACHE = null;

function findCustomerByPhone(phone) {
  const targetPhone =
    normalizePhone(phone);

  const customers =
    getCustomers();

  return customers.find(function(customer) {
    return normalizePhone(customer.phone) === targetPhone;
  }) || null;
}

// =========================
// CUSTOMERS: READ
// =========================

function getCustomerById(customerId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMERS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const idIndex = headers.indexOf('customer_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(customerId)) {
      const result = {};

      headers.forEach(function(header, index) {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getCustomerByPhone(phone) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMERS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const phoneIndex = headers.indexOf('phone');
  const searchKey = getPhoneSearchKey(phone);

  for (let i = 1; i < rows.length; i++) {
    const rowPhone = rows[i][phoneIndex];

    if (getPhoneSearchKey(rowPhone) === searchKey) {
      const result = {};

      headers.forEach(function(header, index) {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getCustomers() {
  if (CUSTOMERS_CACHE) {
    return CUSTOMERS_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMERS);

  const rows =
    sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    CUSTOMERS_CACHE = result;
    return result;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  CUSTOMERS_CACHE = result;
  return result;
}

function resetCustomersCache() {
  CUSTOMERS_CACHE = null;
}
function createOrUpdateCustomer(session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMERS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex = headers.indexOf('customer_id');
  const telegramIdIndex = headers.indexOf('telegram_id');
  const nameIndex = headers.indexOf('name');
  const phoneIndex = headers.indexOf('phone');
  const languageIndex = headers.indexOf('language');
  const createdAtIndex = headers.indexOf('created_at');
  const updatedAtIndex = headers.indexOf('updated_at');
  const lastVisitAtIndex = headers.indexOf('last_visit_at');
  const statusIndex = headers.indexOf('status');
  const notesIndex = headers.indexOf('notes');

  const telegramId = String(session.telegram_id || '').trim();
  const name = String(session.customer_name || '').trim();
  const phone = String(session.customer_phone || '').trim();
  const language = getSettings().Language || 'ru';
  const now = new Date();

  if (!phone) {
    throw new Error('createOrUpdateCustomer: customer_phone is empty');
  }

  if (!name) {
    throw new Error('createOrUpdateCustomer: customer_name is empty');
  }

  for (let i = 1; i < rows.length; i++) {
    const rowPhone = String(rows[i][phoneIndex] || '').trim();

    if (rowPhone === phone) {
      sheet.getRange(i + 1, nameIndex + 1).setValue(name);
      sheet.getRange(i + 1, telegramIdIndex + 1).setValue(telegramId);
      sheet.getRange(i + 1, phoneIndex + 1).setNumberFormat('@');
      sheet.getRange(i + 1, phoneIndex + 1).setValue(phone);
      sheet.getRange(i + 1, languageIndex + 1).setValue(language);
      sheet.getRange(i + 1, updatedAtIndex + 1).setValue(now);

      return rows[i][customerIdIndex];
    }
  }

  const customerId = generateId('cust');

  const newRow = new Array(headers.length).fill('');

  newRow[customerIdIndex] = customerId;
  newRow[telegramIdIndex] = telegramId;
  newRow[nameIndex] = name;
  newRow[phoneIndex] = phone;
  newRow[languageIndex] = language;
  newRow[createdAtIndex] = now;
  newRow[updatedAtIndex] = now;
  newRow[lastVisitAtIndex] = '';
  newRow[statusIndex] = 'lead';
  newRow[notesIndex] = '';

  sheet.appendRow(newRow);

  const rowIndex = sheet.getLastRow();
  sheet.getRange(rowIndex, phoneIndex + 1).setNumberFormat('@');
  sheet.getRange(rowIndex, phoneIndex + 1).setValue(phone);

  return customerId;
}

function updateCustomerStatus(
  customerId,
  status
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMERS);

  const rows =
    sheet.getDataRange().getValues();

  const headers = rows[0];

  const customerIdIndex =
    headers.indexOf('customer_id');

  const statusIndex =
    headers.indexOf('status');

  for (let i = 1; i < rows.length; i++) {

    if (
      String(rows[i][customerIdIndex]) ===
      String(customerId)
    ) {

      sheet
        .getRange(
          i + 1,
          statusIndex + 1
        )
        .setValue(status);

      return;
    }
  }
}
