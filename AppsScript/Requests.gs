

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



function isRequestAlreadyProcessed(requestId) {
  const request = getRequestById(requestId);

  if (!request) {
    return true;
  }

  return request.status !== 'pending';
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
