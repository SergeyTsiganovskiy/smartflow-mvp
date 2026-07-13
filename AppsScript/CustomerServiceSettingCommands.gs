function upsertCustomerServiceSetting(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 1) {
    return false;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const phoneKeyIndex = headers.indexOf('phone_key');

  const serviceIdIndex = headers.indexOf('service_id');

  const targetPhoneKey = getPhoneSearchKey(data.phone || '');

  const targetServiceId = String(data.service_id || '').trim();

  for (let i = 1; i < rows.length; i++) {
    const rowPhoneKey = String(rows[i][phoneKeyIndex] || '').trim();

    const rowServiceId = String(rows[i][serviceIdIndex] || '').trim();

    if (rowPhoneKey === targetPhoneKey && rowServiceId === targetServiceId) {
      setRowValueByHeader(sheet, headers, i + 1, 'profile_id', data.profile_id || '');
      setRowValueByHeader(sheet, headers, i + 1, 'phone', data.phone || '');
      setRowValueByHeader(sheet, headers, i + 1, 'customer_name', data.customer_name || '');
      setRowValueByHeader(sheet, headers, i + 1, 'service_name', data.service_name || '');
      setRowValueByHeader(sheet, headers, i + 1, 'duration_minutes', data.duration_minutes);
      setRowValueByHeader(sheet, headers, i + 1, 'updated_at', new Date());
      setRowValueByHeader(sheet, headers, i + 1, 'notes', data.notes || '');

      return true;
    }
  }

  const newRow = new Array(headers.length).fill('');

  newRow[headers.indexOf('profile_id')] = data.profile_id || '';

  newRow[headers.indexOf('phone')] = data.phone || '';

  newRow[phoneKeyIndex] = targetPhoneKey;

  newRow[headers.indexOf('customer_name')] = data.customer_name || '';

  newRow[serviceIdIndex] = targetServiceId;

  newRow[headers.indexOf('service_name')] = data.service_name || '';

  newRow[headers.indexOf('duration_minutes')] = data.duration_minutes;

  newRow[headers.indexOf('updated_at')] = new Date();

  newRow[headers.indexOf('notes')] = data.notes || '';

  sheet.appendRow(newRow);

  return true;
}

function setRowValueByHeader(sheet, headers, rowNumber, headerName, value) {
  const index = headers.indexOf(headerName);

  if (index === -1) {
    return;
  }

  sheet.getRange(rowNumber, index + 1).setValue(value);
}

function deleteCustomerServiceSetting(customerId, serviceId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const customerIdIndex = headers.indexOf('customer_id');
  const serviceIdIndex = headers.indexOf('service_id');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
    ) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

function deleteCustomerServiceSettingByPhone(phone, serviceId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const phoneKeyIndex = headers.indexOf('phone_key');

  const serviceIdIndex = headers.indexOf('service_id');

  const targetPhoneKey = getPhoneSearchKey(phone);

  for (let i = rows.length - 1; i >= 1; i--) {
    if (
      String(rows[i][phoneKeyIndex]) === String(targetPhoneKey) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
    ) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}
