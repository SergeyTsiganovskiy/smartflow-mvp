function createCustomerVisitHistory(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_VISIT_HISTORY);

  const now = new Date();

  sheet.appendRow([
    'visit_' + now.getTime(),

    data.phone || '',
    getPhoneSearchKey(data.phone || ''),

    data.customer_name || '',

    data.source || '',

    data.appointment_id || '',
    data.calendar_event_id || '',

    data.service_id || '',
    data.service_name || '',

    data.provider_id || '',
    data.provider_name || '',

    data.location_id || '',
    data.location_name || '',

    data.start_at || '',
    data.end_at || '',

    data.status || '',

    data.customer_note || '',

    now,
    now,
    now
  ]);

  resetCustomerVisitHistoryCache();
}

function updateCustomerVisitHistory(visitId, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_VISIT_HISTORY);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const visitIdIndex = headers.indexOf('visit_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][visitIdIndex]) !== String(visitId)) {
      continue;
    }

    Object.keys(updates).forEach(function (key) {
      const columnIndex = headers.indexOf(key);

      if (columnIndex === -1) {
        return;
      }

      rows[i][columnIndex] = updates[key];
    });

    const updatedAtIndex = headers.indexOf('updated_at');

    if (updatedAtIndex !== -1) {
      rows[i][updatedAtIndex] = new Date();
    }

    sheet.getRange(i + 1, 1, 1, headers.length).setValues([rows[i]]);

    resetCustomerVisitHistoryCache();

    return true;
  }

  return false;
}
