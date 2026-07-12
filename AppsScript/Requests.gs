function createRequest(customerId, session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUESTS);

  const headers = sheet.getDataRange().getValues()[0];

  const requestId = generateId('req');
  const now = new Date();

  const newRow = new Array(headers.length).fill('');

  newRow[headers.indexOf('request_id')] = requestId;
  newRow[headers.indexOf('customer_id')] = customerId;
  newRow[headers.indexOf('service_id')] = session.service_id;
  newRow[headers.indexOf('provider_id')] = session.provider_id;
  newRow[headers.indexOf('location_id')] = session.location_id;
  newRow[headers.indexOf('status')] = 'pending';
  newRow[headers.indexOf('created_at')] = now;
  if (headers.indexOf('customer_note') !== -1) {
    newRow[headers.indexOf('customer_note')] =
      session.customer_note || '';
  }
  sheet.appendRow(newRow);

  return requestId;
}

function finalizeRequestFromSession(session) {
  addAuditLog('FINALIZE_START', JSON.stringify(session));

  const customerId = createOrUpdateCustomer(session);
  addAuditLog('FINALIZE_CUSTOMER_CREATED', customerId);

  const requestId = createRequest(customerId, session);
  addAuditLog('FINALIZE_REQUEST_CREATED', requestId);

  createRequestOptions(requestId, session);
  addAuditLog('FINALIZE_OPTIONS_CREATED', requestId);

  return requestId;
}

function getRequestById(requestId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUESTS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('request_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(requestId)) {
      const result = {};

      headers.forEach((header, index) => {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getRequestOptionByPriority(requestId, priority) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUEST_OPTIONS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');
  const priorityIndex = headers.indexOf('priority');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][requestIdIndex]) === String(requestId) &&
      Number(rows[i][priorityIndex]) === Number(priority)
    ) {
      const result = {};

      headers.forEach((header, index) => {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getRequestOptionsByRequestId(requestId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUEST_OPTIONS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (
      String(item.request_id) ===
      String(requestId)
    ) {
      result.push(item);
    }
  }

  result.sort(function(a, b) {
    return Number(a.priority) - Number(b.priority);
  });

  return result;
}

function updateRequestOptionsAfterApproval(requestId, approvedPriority) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUEST_OPTIONS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');
  const priorityIndex = headers.indexOf('priority');
  const statusIndex = headers.indexOf('status');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][requestIdIndex]) === String(requestId)) {
      const status =
        Number(rows[i][priorityIndex]) === Number(approvedPriority)
          ? 'approved'
          : 'rejected';

      sheet.getRange(i + 1, statusIndex + 1).setValue(status);
    }
  }
}

function createRequestOptions(requestId, session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUEST_OPTIONS);

  const headers = sheet.getDataRange().getValues()[0];
  const now = new Date();

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      const newRow = new Array(headers.length).fill('');

      newRow[headers.indexOf('option_id')] = generateId('opt');
      newRow[headers.indexOf('request_id')] = requestId;
      newRow[headers.indexOf('preferred_date')] = date;
      newRow[headers.indexOf('preferred_time')] = time;
      newRow[headers.indexOf('priority')] = i;
      newRow[headers.indexOf('status')] = 'pending';

      if (headers.indexOf('created_at') !== -1) {
        newRow[headers.indexOf('created_at')] = now;
      }

      sheet.appendRow(newRow);
    }
  }
}

function isRequestAlreadyProcessed(requestId) {
  const request = getRequestById(requestId);

  if (!request) {
    return true;
  }

  return request.status !== 'pending';
}

function updateRequestStatus(requestId, status) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUESTS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');
  const statusIndex = headers.indexOf('status');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][requestIdIndex]) === String(requestId)) {
      sheet
        .getRange(i + 1, statusIndex + 1)
        .setValue(status);

      return;
    }
  }
}

function getActiveRequestRecipients() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.REQUEST_RECIPIENTS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    const active =
      String(item.active).toUpperCase();

    const receiveRequests =
      String(item.receive_new_requests)
        .toUpperCase();

    if (
      active === 'TRUE' &&
      receiveRequests === 'TRUE' &&
      item.telegram_id
    ) {
      result.push(item);
    }
  }

  return result;
}
