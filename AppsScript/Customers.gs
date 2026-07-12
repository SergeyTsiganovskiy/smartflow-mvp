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
