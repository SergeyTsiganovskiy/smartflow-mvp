let CUSTOMER_VISIT_HISTORY_CACHE = null;

function resetCustomerVisitHistoryCache() {
  CUSTOMER_VISIT_HISTORY_CACHE = null;
}

function getCustomerVisitHistoryRows() {
  if (CUSTOMER_VISIT_HISTORY_CACHE) {
    return CUSTOMER_VISIT_HISTORY_CACHE;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_VISIT_HISTORY);

  const rows = sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    CUSTOMER_VISIT_HISTORY_CACHE = result;
    return result;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  CUSTOMER_VISIT_HISTORY_CACHE = result;

  return result;
}

function findCustomerVisitByCalendarEventId(calendarEventId) {
  const visits = getCustomerVisitHistoryRows();

  for (let i = 0; i < visits.length; i++) {
    if (String(visits[i].calendar_event_id) === String(calendarEventId)) {
      return visits[i];
    }
  }

  return null;
}

function getCustomerVisitHistoryByPhone(phone) {
  const phoneKey = getPhoneSearchKey(phone);

  const result = getCustomerVisitHistoryRows().filter(function (visit) {
    return String(visit.phone_key) === String(phoneKey);
  });

  result.sort(function (a, b) {
    return new Date(b.start_at) - new Date(a.start_at);
  });

  return result;
}
