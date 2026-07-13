function setLocationActive(locationId, isActive) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows = sheet.getDataRange().getValues();

  const headers = rows[0];

  const idIndex = headers.indexOf('location_id');

  const activeIndex = headers.indexOf('active');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(locationId)) {
      sheet.getRange(i + 1, activeIndex + 1).setValue(isActive);

      break;
    }
  }

  resetLocationsCache();
}

function disableLocation(locationId) {
  setLocationActive(locationId, false);
}

function enableLocation(locationId) {
  setLocationActive(locationId, true);
}

function updateLocationField(locationId, field, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows = sheet.getDataRange().getValues();

  const headers = rows[0];

  const idIndex = headers.indexOf('location_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) !== String(locationId)) {
      continue;
    }

    const fieldIndex = headers.indexOf(field);

    if (fieldIndex !== -1) {
      sheet.getRange(i + 1, fieldIndex + 1).setValue(value);
    }

    break;
  }

  resetLocationsCache();
}
